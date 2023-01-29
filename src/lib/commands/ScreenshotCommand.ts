import BaseCommand from './BaseCommand.js';
import conprint from '../helpers/conprint.js';
import parseError from '../errors/parse-error.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import execShellCmd from '../helpers/exec-shell-cmd.js';
import config from '../../config/config.js';
import * as dateFns from 'date-fns';

import { ICommandInfo } from '../../types/types.js';

/**
 * Command to take a screenshot.
 */
class ScreenshotCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      const FORMAT = 'yyyyMMdd_hhmmss_SSSS';
      const formattedDate = dateFns.format(new Date(), FORMAT);
      let fileName = `adbb_screenshot_${formattedDate}.png`;

      let shellCommand = await buildAdbCommand(`exec-out screencap -p > ${fileName}`, this.options.sid);
      const result = await execShellCmd(shellCommand);

      const filepath = `${process.cwd()}/${fileName}`;
      conprint.info(`Your screenshot image file is saved at ${filepath}`);
      conprint.info(result);

      if (true === this.options.open) {
        console.log('Opening file...');

        try {
          if (config.isWindowsOs) {
            await execShellCmd(`"${filepath}"`);
          } else {
            await execShellCmd(`open "${filepath}"`);
          }
        } catch (e) {
          conprint.error(`[Error opening file] ${e.message}`);
          console.error(e);
        }
      }
    } catch (e) {
      conprint.error(parseError(e));
    }
  }
}

export default ScreenshotCommand;
