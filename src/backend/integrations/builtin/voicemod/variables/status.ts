import { ReplaceVariable } from "../../../../../types/variables";
import { voicemod } from "../voicemod-connection";

export const BackgroundEffectsStatusVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodStatusBackgroundEffects",
        description:
      "Returns 1 if Background Effects is set to on in voicemod, 0 if it's off.",
        possibleDataOutput: ["number"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getBackgroundEffectsStatus()) === true ? 1 : 0;
    }
};

export const HearMyselfStatusVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodStatusHearMyself",
        description:
      "Returns 1 if Hear Myself is set to on in voicemod, 0 if it's off.",
        possibleDataOutput: ["number"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getHearMyselfStatus()) === true ? 1 : 0;
    }
};

export const VoiceChangerStatusVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodStatusVoiceChanger",
        description:
      "Returns 1 if Voice Changer is set to on in voicemod, 0 if it's off.",
        possibleDataOutput: ["number"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getVoiceChangerStatus()) === true ? 1 : 0;
    }
};

export const BeepSoundStatusVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodStatusBeepSound",
        description:
      "Returns 1 if Beep Sound is set to on in voicemod, 0 if it's off.",
        possibleDataOutput: ["number"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getBadLanguageStatus()) === true ? 1 : 0;
    }
};

export const MuteMicStatusVariable: ReplaceVariable = {
    definition: {
        handle: "voicemodStatusMuteMic",
        description: "Returns 1 if Mute is set to on in voicemod, 0 if it's off.",
        possibleDataOutput: ["number"]
    },
    evaluator: async () => {
        return (await voicemod.ws.getMuteMicStatus()) === true ? 1 : 0;
    }
};
