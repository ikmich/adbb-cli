import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import IpManager from '../IpManager';
import NetConfig from '../NetConfig';

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
        }
        output = output.replace(/\n+$/, '');

        consolePrint.info('Device IP address(es):');
        consolePrint.info(output);
    }
}

export default IpCommand;
