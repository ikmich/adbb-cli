import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import buildAdbCommand from '../helpers/build-adb-command';
import askEnterPackage from '../ask/ask-enter-package';
import NoPackageError from '../errors/NoPackageError';
import { yes } from '../helpers/utils';
import consolePrint from '../helpers/console-print';

class ClearCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let adbCmdString = 'shell pm clear';

        switch (true) {
            case yes(this.args[0]):
                // This is the package to be cleared
                adbCmdString += ` ${this.args[0]}`;
                break;
            case yes(this.options.package):
                adbCmdString += ` ${this.options.package}`;
                break;
            default:
                // Request for package
                const answer = await askEnterPackage();
                if (yes(answer) && answer.trim() !== '') {
                    adbCmdString += ` ${answer}`;
                } else {
                    throw new NoPackageError();
                }
                break;
        }

        let shellCmd = await buildAdbCommand(adbCmdString, this.options.sid);

        try {
            const output = await this.exec(shellCmd);
            consolePrint.info(output);
        } catch (e) {
            consolePrint.error(e.message);
        }
    }
}

export default ClearCommand;
