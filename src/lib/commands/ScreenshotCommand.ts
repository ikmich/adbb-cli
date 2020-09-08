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
      let fileName = `Screenshot_${formattedDate}.png`;

      let shellCommand = await buildAdbCommand(`exec-out screencap -p > ${fileName}`);
      const result = await execShellCmd(shellCommand);

      const dest = path.resolve(__dirname, fileName);

      consolePrint.info(`Your screenshot image file is saved at ${dest}`);
      consolePrint.info(result);

      if (true === this.options.open) {
        console.log('Opening file...');
        await execShellCmd(`open "./${fileName}"`);
      }
    } catch (e) {
      consolePrint.error(parseError(e));
    }
  }
}
export default ScreenshotCommand;
