import BaseCommand from './BaseCommand';
import buildAdbCommand from '../helpers/build-adb-command';
import consolePrint from '../helpers/console-print';
import chalk = require('chalk');
import getDevices from "../helpers/get-devices";

class DevicesCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let shellCmd = await buildAdbCommand('devices');
        if (this.options.verbose) {
            shellCmd += ' -l';
        }

        shellCmd = this.applyFilter(shellCmd);

        // const devices = await getDevices();
        // console.table(devices);

        try {
            const output = await this.exec(shellCmd);
            consolePrint.info(output);
        } catch (e) {
            console.log(chalk.red(`Could not run command ${shellCmd}: ${e.message}`));
        }
    }
}

export default DevicesCommand;
