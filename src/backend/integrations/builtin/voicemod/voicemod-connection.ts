import { emit } from "process";
import logger from "../../../../backend/logwrapper";
import VoicemodWebsocket from "@bean-tools/voicemod-websocket";

class Voicemod {
    ws: VoicemodWebsocket | null = null;

    constructor() {
        this.ws = null;
    }

    async connect(host: string, key: string, timeout, retries, enableLock, maxLockTime): Promise<void> {
        logger.debug("Connecting to Voicemod...");
        this.ws = new VoicemodWebsocket(host, key, true, timeout, retries, enableLock, maxLockTime);
        return await this.ws.connect();
    }
}

export const voicemod = new Voicemod();
