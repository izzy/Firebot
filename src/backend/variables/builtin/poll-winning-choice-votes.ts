import { EffectTrigger } from "../../../shared/effect-constants";
import { OutputDataType, VariableCategory } from "../../../shared/variable-constants";

const triggers = {};
triggers[EffectTrigger.EVENT] = [
    "twitch:channel-poll-progress",
    "twitch:channel-poll-end"
];
triggers[EffectTrigger.MANUAL] = true;

const model = {
    definition: {
        handle: "pollWinningChoiceVotes",
        description: "The total number of votes the winning Twitch poll choice received.",
        triggers: triggers,
        categories: [VariableCategory.TRIGGER],
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: (trigger) => {
        return trigger.metadata.eventData.winningChoiceVotes;
    }
};

module.exports = model;