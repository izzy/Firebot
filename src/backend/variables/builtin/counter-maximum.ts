import { TriggersObject } from "../../../types/triggers";
import { ReplaceVariable } from "../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../shared/variable-constants";

const triggers: TriggersObject = {
    counter: true
};

const model: ReplaceVariable = {
    definition: {
        handle: "counterMaximum",
        description: "The maximum value of the counter, or an empty string if there isn't one",
        triggers: triggers,
        categories: [VariableCategory.TRIGGER, VariableCategory.NUMBERS],
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: (trigger) => {
        return trigger.metadata.counter.maximum ?? "";
    }
};

export = model;