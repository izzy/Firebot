import { EffectType } from "../../../../../types/effects";
import { EffectCategory } from "../../../../../shared/effect-constants";
import { EVENT_SOURCE_ID } from "../constants";
import { voicemod } from "../voicemod-connection";
import {
    Soundboard,
    SoundboardSound
} from "@bean-tools/voicemod-websocket/lib/types";

export const PlaySoundEffectType: EffectType<{
    soundId: string;
}> = {
    definition: {
        id: `${EVENT_SOURCE_ID}:play-sound`,
        name: "Voicemod Play Sound",
        description: "Play a sound from the Voicemod soundboard",
        icon: "fad fa-speaker",
        categories: [EffectCategory.INTEGRATIONS]
    },
    optionsTemplate: `
    <eos-container header="Voicemod Sound">
        <ui-select ng-model="selectedSound" on-select="selectSound($select.selected)">
          
          <ui-select-match placeholder="Select a Sound...">{{$select.selected.name}}</ui-select-match>

          <ui-select-choices repeat="sound in sounds | filter: {name: $select.search}">
            <li ng-show="collection.custom === true" role="separator" class="divider"></li>
            <div ng-bind-html="sound.name | highlight: $select.search"></div>
          </ui-select-choices>

        </ui-select>
    </eos-container>
  `,
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.sounds = [];
        $scope.selectedSound = null;

        $q.when(backendCommunicator.fireEventAsync("voicemod-get-sound-list")).then(
            (sounds: SoundboardSound[]) => {
                if (sounds) {
                    $scope.sounds = sounds;
                    if ($scope.effect.soundId) {
                        $scope.selectedSound = sounds.find(
                            (voice) => voice.id === $scope.effect.soundId
                        );
                    }
                }
            }
        );

        $scope.selectSound = (sound: SoundboardSound) => {
            if (sound) {
                $scope.effect.soundId = sound.id;
            }
        };
    },
    optionsValidator: (effect) => {
        if (effect.soundId == null) {
            return ["Please select a sound."];
        }
        return [];
    },
    onTriggerEvent: async (event) => {
        voicemod.ws.getMemes().then((memes) => {
            voicemod.ws.getAllSoundboard().then(async (soundboards: Soundboard[]) => {
                const profile = soundboards.filter((soundboard) => {
                    const sound = soundboard.sounds.filter(
                        (sound) => sound.id === event.effect.soundId
                    );
                    if (sound.length > 0) {
                        return true;
                    }
                    return false;
                });

                if (profile.length === 0) {
                    return;
                }

                const sound = profile[0].sounds.filter(
                    (sound) => sound.id === event.effect.soundId
                )[0];

                const filename = memes.filter((meme) => {
                    if (meme.Name === sound.name) {
                        return true;
                    }
                    return false;

                })[0].FileName;

                voicemod.ws.playMeme(filename);
            });
        });
        return true;
    }
};
