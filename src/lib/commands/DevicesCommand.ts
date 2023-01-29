import BaseCommand from './BaseCommand.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import conprint from '../helpers/conprint.js';
import getDevices from '../helpers/get-devices.js';
import parseError from '../errors/parse-error.js';
import Device from '../core/Device.js';

import { ICommandInfo } from '../../types/types.js';

class DevicesCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      if (this.options.verbose || this.options.json || this.options.grid) {
        switch (true) {
          case this.options.grid: {
            const devices: Device[] = await getDevices();
            console.table(devices);
            break;
          }
          case this.options.json: {
            const devices = await getDevices();
            conprint.success(JSON.stringify(devices, null, 2));
            break;
          }
          default: {
            let shellCmd = await buildAdbCommand('devices -l');
            shellCmd = this.applyFilter(shellCmd);

            try {
              const output = await this.exec(shellCmd);
              conprint.info(output);
            } catch (e) {
              conprint.error(parseError(e).message);
              return;
            }
            break;
          }
        }
      } else {
        let shellCmd = await buildAdbCommand('devices');
        shellCmd = this.applyFilter(shellCmd);
        let output = '';
        try {
          output = await this.exec(shellCmd);
          conprint.info(output);
        } catch (e) {
          conprint.error(parseError(e).message);
          return;
        }
      }
    } catch (e) {
      conprint.error(parseError(e).message);
    }
  }
}

export default DevicesCommand;
