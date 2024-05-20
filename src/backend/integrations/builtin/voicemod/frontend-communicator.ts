import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { voicemod } from "./voicemod-connection";
import {
    SoundboardSound,
    Voice
} from "@bean-tools/voicemod-websocket/lib/types";
import logger from "../../../logwrapper";

export function setupFrontendListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, Voice[]>(
        "voicemod-get-voice-list",
        async () => {
            return (await voicemod.ws.getVoices().catch((r) => {
                logger.warning("Voicemod: Could not retrieve voices");
                return [];
            })) ?? [];
        }
    );

    frontendCommunicator.onAsync<never, SoundboardSound[]>(
        "voicemod-get-sound-list",
        async () => {
            const soundboards = (await voicemod.ws.getAllSoundboard().catch((r) => {
                logger.warning("Voicemod: Could not retrieve sounds");
                return [];
            })) ?? [];
            return soundboards.reduce<SoundboardSound[]>((sounds, soundboard) => {
                return sounds.concat(soundboard.sounds);
            }, []);
        }
    );
}
