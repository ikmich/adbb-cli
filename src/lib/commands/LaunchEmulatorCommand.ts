import BaseCommand from './BaseCommand.js';
import execShellCmd from '../helpers/exec-shell-cmd.js';
import getEmulators from '../helpers/get-emulators.js';
import askSelectEmulator from '../ask/ask-select-emulator.js';
import conprint from '../helpers/conprint.js';
import chalk from 'chalk';

class LaunchEmulatorCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

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

      let emulator: string;
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
