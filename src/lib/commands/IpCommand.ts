import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import IpManager from '../IpManager';
import NetConfig from '../NetConfig';
import UndefinedNetworkConfigError from '../errors/UndefinedNetworkConfigError';
import { yes } from '../helpers/utils';
import { NO_IP_ADDRESS_FOUND } from '../errors/error-constants';

/**
 * Command to get the device's IP address.
 */
class IpCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        const ipManager = new IpManager();
        const netConfigs: NetConfig[] = await ipManager.getDeviceNetworkConfigs();
        let output = '';
        if (netConfigs && netConfigs.length > 0) {
            for (let netConfig of netConfigs) {
                output += netConfig.ip + '\n';
            }
        } else {
            const e = new UndefinedNetworkConfigError();
            consolePrint.error(e.message);
            return;
        }
        output = output.replace(/\n+$/, '');

        if (yes(output)) {
            consolePrint.info('Device IP address(es):');
            consolePrint.info(output);
        } else {
            consolePrint.error(NO_IP_ADDRESS_FOUND);
        }
    }
}

export default IpCommand;
