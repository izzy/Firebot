import { EffectTrigger } from "../../../shared/effect-constants";
import { OutputDataType, VariableCategory } from "../../../shared/variable-constants";

const triggers = {};
triggers[EffectTrigger.EVENT] = [
    "twitch:charity-campaign-start",
    "twitch:charity-campaign-progress",
    "twitch:charity-campaign-end"
];
triggers[EffectTrigger.MANUAL] = true;

const model = {
    definition: {
        handle: "charityCampaignGoal",
        description: "The goal amount for the current charity campaign",
        triggers: triggers,
        categories: [VariableCategory.COMMON, VariableCategory.TRIGGER],
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: (trigger) => {
        const charityCampaignGoal = (trigger.metadata.eventData && trigger.metadata.eventData.targetTotalAmount) || "0";

        return charityCampaignGoal;
    }
};

module.exports = model;