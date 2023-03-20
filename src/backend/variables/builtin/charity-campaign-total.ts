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
        handle: "charityCampaignTotal",
        description: "The total amount raised so far during the current charity campaign",
        triggers: triggers,
        categories: [VariableCategory.COMMON, VariableCategory.TRIGGER],
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: (trigger) => {
        const charityCampaignTotal = (trigger.metadata.eventData && trigger.metadata.eventData.currentTotalAmount) || "0";

        return charityCampaignTotal;
    }
};

module.exports = model;