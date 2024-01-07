import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import logger from "../../../../logwrapper";

export const ToggleBeepEffectType: EffectType<{
    actionStatus: boolean;
}> = {
    definition: {
        id: `${EVENT_SOURCE_ID}:toggle-beep`,
        name: "Voicemod Toggle Beep",
        description: "Enable or disable the beep in Voicemod",
        icon: "fad fa-play-circle",
        categories: [EffectCategory.INTEGRATIONS]
    },
    optionsTemplate: `
    <eos-container header="Voicemod Toggle Beep">
      <div class="btn-group" uib-dropdown>

        <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
        {{getStatusAction()}} <span class="caret"></span>
        </button>

        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
            <li role="menuitem" ng-click="setStatusAction(true)"><a href>Enable</a></li>
            <li role="menuitem" ng-click="setStatusAction(false)"><a href>Disable</a></li>
        </ul>
      </div>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.effect.actionStatus = $scope.effect.actionStatus ?? true;

        $scope.setStatusAction = (actionStatus: boolean) => {
            $scope.effect.actionStatus = actionStatus ?? "";
        };

        $scope.getStatusAction = () => {
            switch ($scope.effect.actionStatus ?? "") {
                case false:
                    return "Disable";
                case true:
                    return "Enable";
                default:
                    return "";
            }
        };
    },
    optionsValidator: (effect) => {
        if (effect.actionStatus == null) {
            return ["Please select a an option."];
        }
        return [];
    },
    onTriggerEvent: async ({ effect }) => {
        logger.debug("Voicemod Toggle Beep", effect.actionStatus);
        voicemod.ws.setBeepSound(effect.actionStatus);
        return true;
    }
};
