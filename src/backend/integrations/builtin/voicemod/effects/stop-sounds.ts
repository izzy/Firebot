import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import logger from "../../../../logwrapper";

export const StopSoundsEffectType: EffectType<{
  actionStatus: boolean;
}> = {
  definition: {
    id: `${EVENT_SOURCE_ID}:stop-sounds`,
    name: "Voicemod Stop Sounds",
    description: "Stop all soundboard sounds in Voicemod",
    icon: "fad fa-play-circle",
    categories: [EffectCategory.INTEGRATIONS],
  },
  optionsTemplate: `
    <eos-container header="Voicemod Toggle Beep">
    </eos-container>
  `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {},
  optionsValidator: () => {
    return [];
  },
  onTriggerEvent: async ({ effect }) => {
    logger.debug("Voicemod Stop Sounds");
    voicemod.ws.stopMemes();
    return true;
  },
};
