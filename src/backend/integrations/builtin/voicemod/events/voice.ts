import { EventSource } from "../../../../../types/events";
import {
    EVENT_SOURCE_ID,
    EVENT_VOICE_CHANGED,
    EVENT_VOICE_LIST_CHANGED,
    EVENT_HEAR_MYSELF_CHANGED,
    EVENT_VOICE_CHANGER_ENABLED_CHANGED
} from "../constants";

export const VoicemodEventSource: EventSource = {
    id: EVENT_SOURCE_ID,
    name: "Voicemod",
    events: [
        {
            id: EVENT_VOICE_CHANGED,
            name: "Voice Changed",
            description: "When the voice is changed in Voicemod",
            manualMetadata: {}
        },
        {
            id: EVENT_VOICE_LIST_CHANGED,
            name: "Voice List Changed",
            description: "When the voice list is updated in Voicemod",
            manualMetadata: {}
        },
        {
            id: EVENT_HEAR_MYSELF_CHANGED,
            name: "Hear Myself Toggled",
            description: "When the hear myself status is changed in Voicemod",
            manualMetadata: {}
        },
        {
            id: EVENT_VOICE_CHANGER_ENABLED_CHANGED,
            name: "Voice Changer Toggled",
            description: "When the voice changer status is changed in Voicemod",
            manualMetadata: {}
        }
    ]
};
