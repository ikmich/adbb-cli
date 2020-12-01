import BaseCommand from './BaseCommand';
import conprint from '../helpers/conprint';
import execShellCmd from '../helpers/exec-shell-cmd';
import parseError from '../errors/parse-error';

class ResetServerCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    try {
      const output1 = await execShellCmd('adb kill-server');
      conprint.info(output1);
    } catch (e) {
      conprint.error(parseError(e).message);
      return;
    }

    setTimeout(async () => {
      try {
        const output2 = await execShellCmd('adb start-server');
        conprint.info(output2);
      } catch (e) {
        conprint.error(parseError(e).message);
      }
    }, 200);
  }
}

export default ResetServerCommand;
