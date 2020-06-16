import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import buildAdbCommand from "../helpers/build-adb-command";

class DevicesCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let shellCmd = await buildAdbCommand('devices');
        if (this.options.verbose) {
            shellCmd += ' -l';
        }

        try {
            const output = await this.exec(shellCmd);
            console.log(chalk.blueBright(output));
        } catch (e) {
            console.log(chalk.red(`Could not run command ${shellCmd}: ${e.message}`));
        }
    }
}

export default DevicesCommand;
