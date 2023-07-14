import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { voicemod } from "./voicemod-connection";
import { Voice } from "@bean-tools/voicemod-websocket/lib/types";

export function setupFrontendListeners(
  frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
  frontendCommunicator.onAsync<never, Voice[]>(
    "voicemod-get-voice-list",
    async () => {
      return (await voicemod.ws.getVoices()) ?? [];
    }
  );
}
