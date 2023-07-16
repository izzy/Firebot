import eventManager from "../../../events/EventManager";
import logger from "../../../logwrapper";

import {
  Integration,
  IntegrationController,
  IntegrationData,
  IntegrationEvents,
} from "@crowbartools/firebot-custom-scripts-types";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import { TypedEmitter } from "tiny-typed-emitter";

import {
  EVENT_HEAR_MYSELF_CHANGED,
  EVENT_SOURCE_ID,
  EVENT_VOICE_CHANGED,
  EVENT_VOICE_CHANGER_ENABLED_CHANGED,
  EVENT_VOICE_LIST_CHANGED,
} from "./constants";

import { voicemod } from "./voicemod-connection";
import { secrets } from "../../../secrets-manager";

import * as frontendCommunicator from "../../../common/frontend-communicator";
import { setupFrontendListeners } from "./frontend-communicator";

import { EventTypes } from "@bean-tools/voicemod-websocket/lib/types";

import {
  registerEffects,
  registerEventSources,
  registerVariables,
} from "./register";
type VoicemodSettings = {
  websocketSettings: {
    host: string;
    timeout: number;
    retries: number;
    debug: boolean;
  };
};

class VoicemodIntegration
  extends TypedEmitter<IntegrationEvents>
  implements IntegrationController<VoicemodSettings>
{
  connected: boolean;
  activeListeners: [(keyof EventTypes)?];
  lastVoiceList?: any;

  constructor(private readonly eventManager: EventManager) {
    super();
    this.connected = false;
    this.activeListeners = [];
  }

  init(
    _linked: boolean,
    _integrationData: IntegrationData<VoicemodSettings>
  ): void | PromiseLike<void> {
    logger.info("Starting Voicemod integration...");

    logger.debug("Registering Voicemod effects and variables...");
    this.registerAll();
  }

  private registerAll() {
    registerEffects();
    registerVariables();
    registerEventSources();

    setupFrontendListeners(frontendCommunicator);
  }

  private async setupConnection(settings?: VoicemodSettings) {
    if (!settings) {
      logger.debug("No settings provided for Voicemod integration.");
      throw new Error("No settings provided for Voicemod integration.");
    }

    logger.debug("Setting up Voicemod connection...");

    await voicemod
      .connect(
        settings.websocketSettings.host,
        secrets.voicemodClientKey,
        settings.websocketSettings.timeout,
        settings.websocketSettings.retries
      )
      .then(() => {
        logger.debug("Voicemod websocket starting");

        voicemod.ws.on("ClientRegistered", async () => {
          logger.debug("Voicemod client registered");

          this.emit("connected", EVENT_SOURCE_ID);
          this.connected = true;

          if (settings.websocketSettings.debug === true) {
            voicemod.ws.on("AllEvents", (data) => {
              logger.debug(
                "Voicemod event received, data: " + JSON.stringify(data)
              );
            });
            this.activeListeners.push("AllEvents");
          }

          voicemod.ws.on("VoiceListChanged", (data) => {
            if (!this.lastVoiceList) {
              this.lastVoiceList = data;
            }

            if (JSON.stringify(this.lastVoiceList) !== JSON.stringify(data)) {
              logger.debug("Voicemod voice list changed");

              eventManager?.triggerEvent(
                EVENT_SOURCE_ID,
                EVENT_VOICE_LIST_CHANGED
              );
            }
          });
          this.activeListeners.push("VoiceListChanged");

          voicemod.ws.on("VoiceChanged", (data) => {
            eventManager?.triggerEvent(EVENT_SOURCE_ID, EVENT_VOICE_CHANGED);
          });
          this.activeListeners.push("VoiceChanged");

          voicemod.ws.on("HearMyselfStatusChanged", (data) => {
            eventManager?.triggerEvent(
              EVENT_SOURCE_ID,
              EVENT_HEAR_MYSELF_CHANGED
            );
          });
          this.activeListeners.push("HearMyselfStatusChanged");

          voicemod.ws.on("VoiceChangerStatusChanged", (data) => {
            eventManager?.triggerEvent(
              EVENT_SOURCE_ID,
              EVENT_VOICE_CHANGER_ENABLED_CHANGED
            );
          });
          this.activeListeners.push("VoiceChangerStatusChanged");
        });

        voicemod.ws.on("Disconnected", () => {
          if (this.connected === true) {
            logger.debug("Voicemod client disconnected");
            this.emit("disconnected", EVENT_SOURCE_ID);
            for (const listener of this.activeListeners) {
              voicemod.ws.removeListener(listener);
            }
            this.connected = false;
          }
        });
      })
      .catch((err) => {
        logger.error(err.message);
        logger.warning(`Could not connect to Voicemod: ${err.message}`);
        this.emit("disconnected", EVENT_SOURCE_ID);
      });
  }

  async connect(
    integrationData: IntegrationData<VoicemodSettings>
  ): Promise<void> {
    logger.debug("Connecting Voicemod integration...");
    try {
      this.setupConnection(integrationData.userSettings);
    } catch (err) {
      logger.error(err.message);
      logger.warning(`Could not connect to Voicemod: ${err.message}`);
      this.emit("disconnected", EVENT_SOURCE_ID);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    logger.debug("Disconnecting Voicemod integration...");

    voicemod.ws.disconnect();
    this.emit("disconnected", EVENT_SOURCE_ID);
    this.connected = false;
  }
}

const integrationConfig: Integration<VoicemodSettings> = {
  definition: {
    id: EVENT_SOURCE_ID,
    name: "Voicemod",
    description:
      "Connect to Voicemod to allow Firebot to change voice and enable the voice changer. Requires Voicemod to be installed and running.",
    linkType: "none",
    configurable: true,
    connectionToggle: true,
    settingCategories: {
      websocketSettings: {
        title: "Websocket Settings",
        sortRank: 1,
        settings: {
          host: {
            title: "Host",
            description:
              "The address of the computer running Voicemod. Use 'localhost' for the same computer.",
            type: "string",
            default: "localhost",
          },
          timeout: {
            title: "Timeout",
            description:
              "The amount of time to wait for a response from Voicemod before the next retry.",
            type: "number",
            default: 5000,
          },
          retries: {
            title: "Retries",
            description:
              "The number of times to retry connecting to Voicemod before giving up. Set to 0 to retry forever.",
            type: "number",
            default: 5,
          },
          debug: {
            title: "Debug",
            description: "Enable extra debug logging for Voicemod.",
            type: "boolean",
            default: false,
          },
        },
      },
    },
  },
  integration: new VoicemodIntegration(eventManager),
};

export const definition = integrationConfig.definition;
export const integration = integrationConfig.integration;
