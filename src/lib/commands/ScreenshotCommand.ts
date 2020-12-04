import BaseCommand from './BaseCommand';
import conprint from '../helpers/conprint';
import parseError from '../errors/parse-error';
import buildAdbCommand from '../helpers/build-adb-command';
import execShellCmd from '../helpers/exec-shell-cmd';
import moment from 'moment';
import path from 'path';
import config from '../../config/config';

class ScreenshotCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      const formattedDate = moment().format('YYYYMMDD_hhmmss_SSSS');
      let fileName = `Screenshot_${formattedDate}.png`;

      let shellCommand = await buildAdbCommand(`exec-out screencap -p > ${fileName}`, this.options.sid);
      const result = await execShellCmd(shellCommand);

      const dest = path.resolve(__dirname, fileName);

      conprint.info(`Your screenshot image file is saved at ${dest}`);
      conprint.info(result);

      if (true === this.options.open) {
        if (config.isWindowsOs) {
          conprint.notice('"open" option is currently not available for Windows');
          return;
        }

        console.log('Opening file...');
        await execShellCmd(`open "./${fileName}"`);
      }
    } catch (e) {
      conprint.error(parseError(e));
    }
  }
}
export default ScreenshotCommand;
