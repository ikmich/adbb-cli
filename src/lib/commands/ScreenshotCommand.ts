import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import parseError from '../errors/parse-error';
import buildAdbCommand from '../helpers/build-adb-command';
import execShellCmd from '../helpers/exec-shell-cmd';

class ScreenshotCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    try {
      let dest = this.options.destination || 'file.png'; // Todo - Use date time for file name

      let shellCommand = await buildAdbCommand(`exec-out screencap -p > ${dest}`);
      const result = await execShellCmd(shellCommand);
      consolePrint.info(result);
    } catch (e) {
      consolePrint.error(parseError(e));
    }
  }
}
export default ScreenshotCommand;
