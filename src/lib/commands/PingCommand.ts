import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import parseError from '../errors/parse-error';
import IpManager, {TPingResult} from '../core/IpManager';

class PingCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        try {
            // Ping the device ip to "wake up" the connection (in case it's in lazy mode)
            const ipManager = new IpManager();
            const deviceIp = await ipManager.getDeviceIp();
            const pingResults: TPingResult = await ipManager.ping(deviceIp);
            const { timeoutPct } = pingResults;

            switch (true) {
                case timeoutPct >= 0 && timeoutPct < 5: {
                    consolePrint.success(`pct timeout: ${timeoutPct}%`);
                    break;
                }
                case timeoutPct >= 5 && timeoutPct < 20: {
                    consolePrint.notice(`pct timeout: ${timeoutPct}%`);
                    break;
                }
                default:
                    consolePrint.error(`pct timeout: ${timeoutPct}%`);
                    break;
            }
        } catch (e) {
            consolePrint.error(parseError(e).message);
        }
    }
}

export default PingCommand;
