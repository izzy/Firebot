import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import logger from "../../../../logwrapper";

export const ToggleBeepEffectType: EffectType<{
    actionTime: number;
}> = {
    definition: {
        id: `${EVENT_SOURCE_ID}:toggle-beep-for`,
        name: "Voicemod Toggle Beep For Time",
        description: "Enable the beep in Voicemod for a specified time",
        icon: "fad fa-play-circle",
        categories: [EffectCategory.INTEGRATIONS]
    },
    optionsTemplate: `
    <eos-container header="Voicemod Toggle Beep">
      <div class="btn-group" uib-dropdown>

        <input id="single-button" type="number" class="btn btn-default">
        {{getStatusAction()}} <span class="caret"></span>
        </input>

        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
            <li role="menuitem" ng-click="setStatusAction(true)"><a href>Enable</a></li>
            <li role="menuitem" ng-click="setStatusAction(false)"><a href>Disable</a></li>
        </ul>
      </div>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.effect.actionTime = $scope.effect.actionTime ?? 1000;

        $scope.setStatusAction = (actionStatus: number) => {
            $scope.effect.actionTime = actionStatus ?? 1000;
        };

        $scope.getStatusAction = () => {
            return $scope.effect.actionStatus ?? 1000;
        };
    },
    optionsValidator: (effect) => {
        if (effect.actionTime == null) {
            return ["Please enter a time."];
        }
        return [];
    },
    onTriggerEvent: async ({ effect }) => {
        logger.debug("Voicemod Toggle Beep");
        voicemod.ws.setBeepSound(true);
        setTimeout(() => {
            voicemod.ws.setBeepSound(false);
        }, effect.actionTime);
        return true;
    }
};
