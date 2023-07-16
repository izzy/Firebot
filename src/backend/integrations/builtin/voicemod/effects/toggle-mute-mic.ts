import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";

export const ToggleMuteMicEffectType: EffectType<{
  actionStatus: boolean | string;
}> = {
  definition: {
    id: `${EVENT_SOURCE_ID}:toggle-mute-mic`,
    name: "Voicemod Toggle Micrphone Mute",
    description: "Enable or disable the microphone mute in Voicemod",
    icon: "fad fa-play-circle",
    categories: [EffectCategory.INTEGRATIONS],
  },
  optionsTemplate: `
    <eos-container header="Voicemod Toggle Mic Mute">
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
    let currentState = await voicemod.ws.getMuteMicStatus();
    if (
      effect.actionStatus === "toggle" ||
      effect.actionStatus !== currentState
    ) {
      voicemod.ws.toggleMuteMic();
    }

    return true;
  },
};
