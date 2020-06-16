import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import buildAdbCommand from '../helpers/build-adb-command';
import askEnterPackage from '../ask/ask-enter-package';
import NoPackageError from '../errors/NoPackageError';

class ClearCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let optsString = 'shell pm clear';
        if (this.options.package) {
            optsString += ` ${this.options.package}`;
        } else {
            // Request for package
            const answer = await askEnterPackage();
            if (typeof answer !== 'undefined' && answer && answer.trim() !== '') {
                optsString += ` ${answer}`;
            } else {
                throw new NoPackageError();
            }
        }
        let shellCmd = await buildAdbCommand(optsString, this.options.sid);

        try {
            const output = await this.exec(shellCmd);
            console.log(chalk.blueBright(output));
        } catch (e) {
            console.log(chalk.red(e.message));
        }
    }
}

export default ClearCommand;
