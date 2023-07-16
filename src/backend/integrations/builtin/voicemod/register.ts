import eventManager from "../../../events/EventManager";
import effectManager from "../../../effects/effectManager";
import replaceVariableManager from "../../../variables/replace-variable-manager";

import { SetVoiceEffectType } from "./effects/set-voice";
import { ToggleHearMyselfEffectType } from "./effects/toggle-hear-myself";
import { VoicemodEventSource } from "./events/voice";
import {
  HearMyselfStatusVariable,
  VoiceChangerStatusVariable,
} from "./variables/status";
import {
  CurrentVoiceIdVariable,
  CurrentVoiceNameVariable,
} from "./variables/voice";
import { ToggleVoiceChangerEffectType } from "./effects/toggle-voicechanger";
import { SetRandomVoiceEffectType } from "./effects/set-random-voice";

export function registerEventSources() {
  eventManager.registerEventSource(VoicemodEventSource);
}

export function registerEffects() {
  effectManager.registerEffect(SetVoiceEffectType);
  effectManager.registerEffect(SetRandomVoiceEffectType);
  effectManager.registerEffect(ToggleVoiceChangerEffectType);
  effectManager.registerEffect(ToggleHearMyselfEffectType);
}

export function registerVariables() {
  replaceVariableManager.registerReplaceVariable(CurrentVoiceNameVariable);
  replaceVariableManager.registerReplaceVariable(CurrentVoiceIdVariable);
  replaceVariableManager.registerReplaceVariable(HearMyselfStatusVariable);
  replaceVariableManager.registerReplaceVariable(VoiceChangerStatusVariable);
}
