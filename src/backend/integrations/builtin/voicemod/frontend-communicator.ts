import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { voicemod } from "./voicemod-connection";
import {
    SoundboardSound,
    Voice
} from "@bean-tools/voicemod-websocket/lib/types";

export function setupFrontendListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, Voice[]>(
        "voicemod-get-voice-list",
        async () => {
            return (await voicemod.ws.getVoices()) ?? [];
        }
    );

    frontendCommunicator.onAsync<never, SoundboardSound[]>(
        "voicemod-get-sound-list",
        async () => {
            const soundboards = (await voicemod.ws.getAllSoundboard()) ?? [];
            return soundboards.reduce<SoundboardSound[]>((sounds, soundboard) => {
                return sounds.concat(soundboard.sounds);
            }, []);
        }
    );
}
