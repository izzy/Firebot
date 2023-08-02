import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import { SelectVoiceMode } from "@bean-tools/voicemod-websocket/lib/types";

export const SetRandomVoiceEffectType: EffectType<{
  randomMode: SelectVoiceMode;
}> = {
  definition: {
    id: `${EVENT_SOURCE_ID}:set-random-voice`,
    name: "Set Random Voicemod voice",
    description: "Set the active Voicemod voice to a random voice",
    icon: "fad fa-microphone",
    categories: [EffectCategory.INTEGRATIONS],
  },
  optionsTemplate: `
    <eos-container header="Voicemod Random Voice">
      <div class="btn-group" uib-dropdown>
        <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
          {{getRandomMode()}} <span class="caret"></span>
        </button>

        <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
          <li role="menuitem" ng-click="setRandomMode('AllVoices')"><a href>All Voices</a></li>
          <li role="menuitem" ng-click="setRandomMode('FreeVoices')"><a href>Free Voices</a></li>
          <li role="menuitem" ng-click="setRandomMode('FavoriteVoices')"><a href>Favorite Voices</a></li>
          <li role="menuitem" ng-click="setRandomMode('CustomVoices')"><a href>Custom Voicese</a></li>
        </ul>
      </div>
    </eos-container>
  `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.setRandomMode = (mode: "toggle" | boolean) => {
      $scope.effect.randomMode = mode ?? "AllVoices";
    };

    $scope.getRandomMode = () => {
      switch ($scope.effect.randomMode ?? "") {
        case "AllVoices":
          return "All Voices";
        case "FreeVoices":
          return "Free Voices";
        case "FavoriteVoices":
          return "Favorite Voices";
        case "CustomVoices":
          return "Custom Voices";
        default:
          return "";
      }
    };
  },
  optionsValidator: (effect) => {
    if (effect.randomMode == null) {
      return ["Please select a mode."];
    }
    return [];
  },
  onTriggerEvent: async (event) => {
    voicemod.ws.selectRandomVoice(event.effect.randomMode);
  },
};
