import { ReplaceVariable } from "../../../../../types/variables";
import { voicemod } from "../voicemod-connection";

export const HearMyselfStatusVariable: ReplaceVariable = {
  definition: {
    handle: "voicemodStatusHearMyself",
    description:
      "Returns 1 if Hear Myself is set to on in voicemod, 0 if it's off.",
    possibleDataOutput: ["number"],
  },
  evaluator: async () => {
    return (await voicemod.ws.getHearMyselfStatus()) === true ? 1 : 0;
  },
};

export const VoiceChangerStatusVariable: ReplaceVariable = {
  definition: {
    handle: "voicemodStatusVoiceChanger",
    description:
      "Returns 1 if Voice Changer is set to on in voicemod, 0 if it's off.",
    possibleDataOutput: ["number"],
  },
  evaluator: async () => {
    return (await voicemod.ws.getVoiceChangerStatus()) === true ? 1 : 0;
  },
};
