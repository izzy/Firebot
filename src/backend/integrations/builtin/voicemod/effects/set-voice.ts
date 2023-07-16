import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import { Voice } from "@bean-tools/voicemod-websocket/lib/types";

export const SetVoiceEffectType: EffectType<{
  voiceId: string;
}> = {
  definition: {
    id: `${EVENT_SOURCE_ID}:set-voice`,
    name: "Set Voicemod voice",
    description: "Set the active Voicemod voice",
    icon: "fad fa-microphone",
    categories: [EffectCategory.INTEGRATIONS],
  },
  optionsTemplate: `
    <eos-container header="Voicemod Voice">
        <ui-select ng-model="selectedVoice" on-select="selectVoice($select.selected)">
          
          <ui-select-match placeholder="Select a Voice...">{{$select.selected.friendlyName}}</ui-select-match>

          <ui-select-choices repeat="voice in voices | filter: {friendlyName: $select.search}">
            <li ng-show="collection.custom === true" role="separator" class="divider"></li>
            <div ng-bind-html="voice.friendlyName | highlight: $select.search"></div>
          </ui-select-choices>

        </ui-select>
    </eos-container>
  `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.voices = [];
    $scope.selectedVoice = null;

    $q.when(backendCommunicator.fireEventAsync("voicemod-get-voice-list")).then(
      (voices: Voice[]) => {
        if (voices) {
          $scope.voices = voices;
          if ($scope.effect.voiceId) {
            $scope.selectedVoice = voices.find(
              (voice) => voice.id === $scope.effect.voiceId
            );
          }
        }
      }
    );

    $scope.selectVoice = (voice: Voice) => {
      if (voice) {
        $scope.effect.voiceId = voice.id;
      }
    };
  },
  optionsValidator: (effect) => {
    if (effect.voiceId == null) {
      return ["Please select a voice."];
    }
    return [];
  },
  onTriggerEvent: async (event) => {
    await voicemod.ws.setVoice(event.effect.voiceId);
  },
};
