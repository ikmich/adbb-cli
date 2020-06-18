import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import buildAdbCommand from "../helpers/build-adb-command";

class PackagesCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let shellCmd = await buildAdbCommand('shell pm list packages', this.options.sid);
        shellCmd = this.applyFilter(shellCmd);

        try {
            const output = await this.exec(shellCmd);
            console.log(chalk.blueBright(output));
        } catch (e) {
            console.log(chalk.red(e.message));
        }
    }
}

export default PackagesCommand;
