import BaseCommand from './BaseCommand.js';
import conprint from '../helpers/conprint.js';
import parseError from '../errors/parse-error.js';
import IpManager, { TPingResult } from '../core/IpManager.js';

class PingCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      // Ping the device ip to "wake up" the connection (in case it's in lazy mode)
      const ipManager = new IpManager();
      const deviceIp = await ipManager.getDeviceIp(this.options.sid);
      const pingResults: TPingResult = await ipManager.ping(deviceIp);
      const { timeoutPct } = pingResults;

      switch (true) {
        case timeoutPct >= 0 && timeoutPct < 5: {
          conprint.success(`pct timeout: ${timeoutPct}%`);
          break;
        }
        case timeoutPct >= 5 && timeoutPct < 20: {
          conprint.notice(`pct timeout: ${timeoutPct}%`);
          break;
        }
        default:
          conprint.error(`pct timeout: ${timeoutPct}%`);
          break;
      }
    } catch (e) {
      conprint.error(parseError(e).message);
    }
  }
}

export default PingCommand;
