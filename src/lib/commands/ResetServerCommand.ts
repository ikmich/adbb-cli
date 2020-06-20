import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import execShellCmd from '../helpers/exec-shell-cmd';
import errorParser from '../errors/error-parser';

class ResetServerCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        try {
            const output1 = await execShellCmd('adb kill-server');
            consolePrint.info(output1);
        } catch (e) {
            consolePrint.error(errorParser.parse(e).message);
            return;
        }

        try {
            const output2 = await execShellCmd('adb start-server');
            consolePrint.info(output2);
        } catch (e) {
            consolePrint.error(errorParser.parse(e).message);
        }
    }
}

export default ResetServerCommand;
