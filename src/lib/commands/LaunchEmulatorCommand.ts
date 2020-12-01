import BaseCommand from './BaseCommand';
import execShellCmd from '../helpers/exec-shell-cmd';
import getEmulators from '../helpers/get-emulators';
import askSelectEmulator from '../ask/ask-select-emulator';
import conprint from '../helpers/conprint';
import chalk = require('chalk');

class LaunchEmulatorCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    try {
      const emulators = await getEmulators();

      if (this.options.list) {
        // Display list of emulators.
        if (emulators && emulators.length > 0) {
          let lines: string[] = [];
          for (let emulator of emulators) {
            lines.push(emulator);
          }
          conprint.plain('Available emulators:');
          conprint.info(lines.join('\n'));
          return;
        }
      }

      let emulator = '';
      if (emulators && emulators.length > 0) {
        console.log(chalk.blue('Multiple emulators available'));
        emulator = await askSelectEmulator();
      } else {
        emulator = emulators[0];
      }

      // Run command to launch emulator
      const output = await execShellCmd(`emulator @${emulator}`);
      console.log(output);
    } catch (e) {
      console.log(chalk.red(`Could not run command ${this.name}: ${e.message}`));
    }
  }
}

export default LaunchEmulatorCommand;
