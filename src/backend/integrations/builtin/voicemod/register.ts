import eventManager from "../../../events/EventManager";
import effectManager from "../../../effects/effectManager";
import replaceVariableManager from "../../../variables/replace-variable-manager";

import { SetVoiceEffectType } from "./effects/set-voice";
import { ToggleHearMyselfEffectType } from "./effects/toggle-hear-myself";
import { VoicemodEventSource } from "./events/voice";
import {
  BackgroundEffectsStatusVariable,
  HearMyselfStatusVariable,
  VoiceChangerStatusVariable,
} from "./variables/status";
import {
  CurrentVoiceIdVariable,
  CurrentVoiceNameVariable,
} from "./variables/voice";
import { ToggleVoiceChangerEffectType } from "./effects/toggle-voicechanger";
import { SetRandomVoiceEffectType } from "./effects/set-random-voice";
import { ToggleBackgroundEffectsEffectType } from "./effects/toggle-background-effects";

export function registerEventSources() {
  eventManager.registerEventSource(VoicemodEventSource);
}

export function registerEffects() {
  effectManager.registerEffect(SetVoiceEffectType);
  effectManager.registerEffect(SetRandomVoiceEffectType);
  effectManager.registerEffect(ToggleBackgroundEffectsEffectType);
  effectManager.registerEffect(ToggleHearMyselfEffectType);
  effectManager.registerEffect(ToggleVoiceChangerEffectType);
}

export function registerVariables() {
  replaceVariableManager.registerReplaceVariable(CurrentVoiceNameVariable);
  replaceVariableManager.registerReplaceVariable(CurrentVoiceIdVariable);
  replaceVariableManager.registerReplaceVariable(
    BackgroundEffectsStatusVariable
  );
  replaceVariableManager.registerReplaceVariable(HearMyselfStatusVariable);
  replaceVariableManager.registerReplaceVariable(VoiceChangerStatusVariable);
}
