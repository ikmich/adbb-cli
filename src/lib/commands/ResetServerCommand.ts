import BaseCommand from './BaseCommand.js';
import conprint from '../helpers/conprint.js';
import execShellCmd from '../helpers/exec-shell-cmd.js';
import parseError from '../errors/parse-error.js';
import { wait, yes } from '../helpers/utils.js';
import getDevices from '../helpers/get-devices.js';

import { ICommandInfo } from '../../types/types.js';

/**
 * Reset the adb server. Like running "adb kill-server" then "adb start-server" in succession.
 */
class ResetServerCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      const output_kill_server = await execShellCmd('adb kill-server');
      conprint.info(output_kill_server);

      await wait(500);
      const output_start_server = await execShellCmd('adb start-server');
      conprint.info(output_start_server);
    } catch (e) {
      conprint.error(parseError(e).message);
      return;
    }
  }
}

export default ResetServerCommand;
