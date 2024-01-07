import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";

export const ToggleVoiceChangerEffectType: EffectType<{
    actionStatus: boolean | string;
}> = {
    definition: {
        id: `${EVENT_SOURCE_ID}:toggle-voicechanger`,
        name: "Voicemod Toggle Voice Changer",
        description: "Enable or disable the voice changer in Voicemod",
        icon: "fad fa-play-circle",
        categories: [EffectCategory.INTEGRATIONS]
    },
    optionsTemplate: `
    <eos-container header="Voicemod Toggle Voice Changer">
      <div class="btn-group" uib-dropdown>

        <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
        {{getStatusAction()}} <span class="caret"></span>
        </button>

        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
            <li role="menuitem" ng-click="setStatusAction(true)"><a href>Enable</a></li>
            <li role="menuitem" ng-click="setStatusAction(false)"><a href>Disable</a></li>
            <li role="menuitem" ng-click="setStatusAction('toggle')"><a href>Toggle</a></li>
        </ul>
      </div>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.effect.actionStatus = $scope.effect.actionStatus ?? true;

        $scope.setStatusAction = (actionStatus: "toggle" | boolean) => {
            $scope.effect.actionStatus = actionStatus ?? "";
        };

        $scope.getStatusAction = () => {
            switch ($scope.effect.actionStatus ?? "") {
                case "toggle":
                    return "Toggle";
                case false:
                    return "Disable";
                case true:
                    return "Enable";
                default:
                    return "";
            }
        };
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async ({ effect }) => {
        let nextState;
        if (effect.actionStatus === "toggle") {
            nextState = !(await voicemod.ws.getVoiceChangerStatus());
        } else {
            nextState = effect.actionStatus;
        }

        voicemod.ws.toggleVoiceChanger(nextState);
        return true;
    }
};
