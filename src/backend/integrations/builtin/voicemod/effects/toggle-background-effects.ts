import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";

export const ToggleBackgroundEffectsEffectType: EffectType<{
  actionStatus: boolean | string;
}> = {
  definition: {
    id: `${EVENT_SOURCE_ID}:toggle-background-effects`,
    name: "Voicemod Toggle Background Effects",
    description:
      "Enable or disable the voice changer background effects in Voicemod",
    icon: "fad fa-play-circle",
    categories: [EffectCategory.INTEGRATIONS],
  },
  optionsTemplate: `
    <eos-container header="Voicemod Toggle Background Effects">
      <div class="btn-group" uib-dropdown>

        <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
        {{getBackgroundEffectStatus()}} <span class="caret"></span>
        </button>

        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
            <li role="menuitem" ng-click="setBackgroundEffectStatus(true)"><a href>Enable</a></li>
            <li role="menuitem" ng-click="setBackgroundEffectStatus(false)"><a href>Disable</a></li>
            <li role="menuitem" ng-click="setBackgroundEffectStatus('toggle')"><a href>Toggle</a></li>
        </ul>
      </div>
    </eos-container>
  `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.effect.actionStatus = $scope.effect.actionStatus ?? true;

    $scope.setBackgroundEffectStatus = (actionStatus: "toggle" | boolean) => {
      $scope.effect.actionStatus = actionStatus ?? "";
    };

    $scope.getBackgroundEffectStatus = () => {
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
    const currentState = await voicemod.ws.getBackgroundEffectsStatus();
    if (effect.actionStatus === "toggle") {
      nextState = !currentState;
    } else {
      if (effect.actionStatus === currentState) {
        return;
      }

      nextState = effect.actionStatus;
    }

    voicemod.ws.toggleBackgroundEffects();
    return true;
  },
};
