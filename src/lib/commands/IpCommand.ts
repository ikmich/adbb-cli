import BaseCommand from './BaseCommand';
import conprint from '../helpers/conprint';
import IpManager from '../core/IpManager';
import NetConfig from '../core/NetConfig';
import UndefinedNetworkConfigError from '../errors/UndefinedNetworkConfigError';
import { yes } from '../helpers/utils';
import { NO_IP_ADDRESS_FOUND } from '../errors/error-constants';
import parseError from '../errors/parse-error';

/**
 * Command to get the device's IP address.
 */
class IpCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      const ipManager = new IpManager();
      const netConfigs: NetConfig[] = await ipManager.getDeviceNetworkConfigs(this.options.sid);
      let output = '';
      if (netConfigs && netConfigs.length > 0) {
        for (let netConfig of netConfigs) {
          output += netConfig.ip + '\n';
        }
      } else {
        const e = new UndefinedNetworkConfigError();
        conprint.error(e.message);
        return;
      }
      output = output.replace(/\n+$/, '');

      if (yes(output)) {
        conprint.info('Device IP address(es):');
        conprint.info(output);
      } else {
        conprint.error(NO_IP_ADDRESS_FOUND);
      }
    } catch (e) {
      conprint.error(parseError(e));
    }
  }
}

export default IpCommand;
