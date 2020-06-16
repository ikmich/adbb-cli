import { CommandInfo } from '../../types/CommandInfo.type';
import WifiCommand from '../commands/WifiCommand';
import { CMD_CLEAR, CMD_DEVICES, CMD_EMU, CMD_EMULATOR, CMD_PACKAGES, CMD_PKGS, CMD_WIFI } from '../constants';
import DevicesCommand from '../commands/DevicesCommand';
import PackagesCommand from '../commands/PackagesCommand';
import getCliCommandString from './get-cli-command-string';
import ClearCommand from '../commands/ClearCommand';
import errorParser from '../errors/error-parser';
import runShellCmd from './run-shell-cmd';
import LaunchEmulatorCommand from '../commands/LaunchEmulatorCommand';
import chalk = require('chalk');

const commandDispatcher = {
    dispatch: async (commandInfo: CommandInfo) => {
        const mainCommand = commandInfo.name;

        switch (mainCommand) {
            case CMD_DEVICES:
                await new DevicesCommand(commandInfo).run();
                break;

            case CMD_PACKAGES:
            case CMD_PKGS:
                await new PackagesCommand(commandInfo).run();
                break;

            case CMD_WIFI:
                await new WifiCommand(commandInfo).run();
                break;

            case CMD_CLEAR:
                await new ClearCommand(commandInfo).run();
                break;

            case CMD_EMU:
            case CMD_EMULATOR:
                await new LaunchEmulatorCommand(commandInfo).run();
                break;

            default:
                const cliCommand = await getCliCommandString();

                if (cliCommand) {
                    if (cliCommand === 'shell') {
                        console.log(chalk.yellow(`NOTICE: Run "adb shell" in your terminal`));
                        break;
                    }

                    console.log(chalk.blue('Running regular adb command...'));

                    try {
                        const shellCmd = `adb ${cliCommand}`;
                        const output = await runShellCmd(shellCmd);
                        console.log(output);
                    } catch (e) {
                        console.log(chalk.red(errorParser.parse(e).message));
                    }
                } else {
                    // console.log(chalk.red(`No such command: ${mainCommand}`));
                }

                break;
        }
    },
};

export default commandDispatcher;
