import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import parseError from '../errors/parse-error';
import buildAdbCommand from '../helpers/build-adb-command';
import execShellCmd from '../helpers/exec-shell-cmd';
import moment from 'moment';
import path from 'path';

class ScreenshotCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    try {
      const formattedDate = moment().format('YYYYMMDD_hhmmss_SSSS');
      let dest = `Screenshot_${formattedDate}.png`;

      let shellCommand = await buildAdbCommand(`exec-out screencap -p > ${dest}`);
      const result = await execShellCmd(shellCommand);

      consolePrint.info(`Your screenshot image file is saved at ${path.resolve(__dirname, dest)}`);
      consolePrint.info(result);
    } catch (e) {
      consolePrint.error(parseError(e));
    }
  }
}
export default ScreenshotCommand;
