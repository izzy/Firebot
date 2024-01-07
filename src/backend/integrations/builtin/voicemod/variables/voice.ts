import { ReplaceVariable } from "../../../../../types/variables";
import { voicemod } from "../voicemod-connection";

export const CurrentVoiceNameVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodCurrentVoiceName",
        description: "Returns the name of the current active voice in Voicemod.",
        possibleDataOutput: ["text"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getCurrentVoice()).friendlyName ?? "";
    }
};

export const CurrentVoiceIdVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodCurrentVoiceId",
        description: "Returns the ID of the current active voice in Voicemod.",
        possibleDataOutput: ["text"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getCurrentVoice()).id ?? "";
    }
};
