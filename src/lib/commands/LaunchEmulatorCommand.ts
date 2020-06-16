import BaseCommand from './BaseCommand';
import runShellCmd from '../helpers/run-shell-cmd';
import getEmulators from '../helpers/get-emulators';
import askSelectEmulator from '../ask/ask-select-emulator';
import chalk = require('chalk');

class LaunchEmulatorCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        try {
            const emulators = await getEmulators();
            let emulator = '';
            if (emulators && emulators.length > 0) {
                console.log(chalk.blue('Multiple emulators available'));
                emulator = await askSelectEmulator();
            } else {
                emulator = emulators[0];
            }

            // Run command to launch emulator
            const output = await runShellCmd(`emulator @${emulator}`);
            console.log(output);
        } catch (e) {
            console.log(chalk.red(`Could not run command ${this.name}: ${e.message}`));
        }
    }
}

export default LaunchEmulatorCommand;
