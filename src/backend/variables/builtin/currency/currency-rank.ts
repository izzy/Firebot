import { ReplaceVariable } from "../../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../../shared/variable-constants";

import currencyAccess from "../../../currency/currency-access";
import currencyManager from "../../../currency/currency-manager";

const model : ReplaceVariable = {
    definition: {
        handle: "currencyRank",
        description: "Returns the rank of the given user based on how much of the given currency they have.",
        usage: "currencyRank[currencyName, username]",
        categories: [VariableCategory.USER, VariableCategory.NUMBERS],
        possibleDataOutput: [OutputDataType.NUMBER]
    },
    evaluator: async (_, currencyName: string, username: string) => {
        if (currencyName == null || username == null) {
            return 0;
        }

        const currency = currencyAccess.getCurrencyByName(currencyName);

        if (currency == null) {
            return 0;
        }

        return await currencyManager.getViewerCurrencyRank(currency.id, username, true);
    }
};

export default model;