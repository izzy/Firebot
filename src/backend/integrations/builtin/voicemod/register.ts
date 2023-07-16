import eventManager from "../../../events/EventManager";
import effectManager from "../../../effects/effectManager";
import replaceVariableManager from "../../../variables/replace-variable-manager";

import { SetVoiceEffectType } from "./effects/set-voice";
import { ToggleHearMyselfEffectType } from "./effects/toggle-hear-myself";
import { VoicemodEventSource } from "./events/voice";
import {
  BackgroundEffectsStatusVariable,
  BeepSoundStatusVariable,
  HearMyselfStatusVariable,
  MuteMicStatusVariable,
  VoiceChangerStatusVariable,
} from "./variables/status";
import {
  CurrentVoiceIdVariable,
  CurrentVoiceNameVariable,
} from "./variables/voice";
import { ToggleVoiceChangerEffectType } from "./effects/toggle-voicechanger";
import { SetRandomVoiceEffectType } from "./effects/set-random-voice";
import { ToggleBackgroundEffectsEffectType } from "./effects/toggle-background-effects";
import { ToggleBeepEffectType } from "./effects/toggle-beep";
import { ToggleMuteMicEffectType } from "./effects/toggle-mute-mic";
import { PlaySoundEffectType } from "./effects/play-sound";
import { StopSoundsEffectType } from "./effects/stop-sounds";

export function registerEventSources() {
  eventManager.registerEventSource(VoicemodEventSource);
}

export function registerEffects() {
  effectManager.registerEffect(PlaySoundEffectType);
  effectManager.registerEffect(SetRandomVoiceEffectType);
  effectManager.registerEffect(SetVoiceEffectType);
  effectManager.registerEffect(StopSoundsEffectType);
  effectManager.registerEffect(ToggleBackgroundEffectsEffectType);
  effectManager.registerEffect(ToggleBeepEffectType);
  effectManager.registerEffect(ToggleHearMyselfEffectType);
  effectManager.registerEffect(ToggleMuteMicEffectType);
  effectManager.registerEffect(ToggleVoiceChangerEffectType);
}

export function registerVariables() {
  replaceVariableManager.registerReplaceVariable(CurrentVoiceNameVariable);
  replaceVariableManager.registerReplaceVariable(CurrentVoiceIdVariable);
  replaceVariableManager.registerReplaceVariable(
    BackgroundEffectsStatusVariable
  );
  replaceVariableManager.registerReplaceVariable(BeepSoundStatusVariable);
  replaceVariableManager.registerReplaceVariable(HearMyselfStatusVariable);
  replaceVariableManager.registerReplaceVariable(MuteMicStatusVariable);
  replaceVariableManager.registerReplaceVariable(VoiceChangerStatusVariable);
}
