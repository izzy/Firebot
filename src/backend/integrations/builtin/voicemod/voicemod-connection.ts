import logger from "../../../../backend/logwrapper";
import VoicemodWebsocket from "@bean-tools/voicemod-websocket";

class Voicemod {
  ws: VoicemodWebsocket | null = null;

  constructor() {
    this.ws = null;
  }

  async connect(host: string, key: string, timeout, retries): Promise<void> {
    logger.debug("Connecting to Voicemod...");
    this.ws = new VoicemodWebsocket(host, key, true, timeout, retries);
    return await this.ws.connect();
  }
}

export const voicemod = new Voicemod();
