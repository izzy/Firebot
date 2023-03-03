import { EventSubChannelPollChoice } from "@twurple/eventsub-base";
import { EffectTrigger } from "../../../shared/effect-constants";
import { OutputDataType, VariableCategory } from "../../../shared/variable-constants";

const triggers = {};
triggers[EffectTrigger.EVENT] = ["twitch:channel-poll-end"];
triggers[EffectTrigger.MANUAL] = true;

const model = {
    definition: {
        handle: "pollWinningChoiceName",
        description: "The name of the winning Twitch poll choice.",
        triggers: triggers,
        categories: [VariableCategory.TRIGGER],
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: (trigger) => {
        const choices: EventSubChannelPollChoice[] = trigger.metadata.eventData.choices;

        const winningChoice = choices.sort((c1: EventSubChannelPollChoice, c2:EventSubChannelPollChoice) => {
            return c1.totalVotes < c2.totalVotes ? 1 : -1;
        })[0];
    
        return winningChoice.title;
    }
};

module.exports = model;