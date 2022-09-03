import { ICommandInfo } from '../../types/ICommandInfo.js';
import WifiCommand from '../commands/WifiCommand.js';
import DevicesCommand from '../commands/DevicesCommand.js';
import ListPackagesCommand from '../commands/ListPackagesCommand.js';
import getCommandArgsString from './get-command-args-string.js';
import ClearCommand from '../commands/ClearCommand.js';
import execShellCmd from './exec-shell-cmd.js';
import LaunchEmulatorCommand from '../commands/LaunchEmulatorCommand.js';
import IpCommand from '../commands/IpCommand.js';
import ResetServerCommand from '../commands/ResetServerCommand.js';
import {
  CMD_CLEAR,
  CMD_DEVICES,
  CMD_EMU,
  CMD_EMULATOR,
  CMD_IP,
  CMD_SET_DEFAULT_PACKAGE,
  CMD_PACKAGES,
  CMD_PATH,
  CMD_PING,
  CMD_SET_DEFAULT_PKG,
  CMD_PKGS,
  CMD_RESET_SERVER,
  CMD_SCREENSHOT,
  CMD_SCRSHOT,
  CMD_UNINSTALL,
  CMD_UNSET_DEFAULT_PACKAGE,
  CMD_UNSET_DEFAULT_PKG,
  CMD_WIFI,
} from '../../command-constants.js';
import conprint from './conprint.js';
import SetPackageCommand from '../commands/SetPackageCommand.js';
import store from './store.js';
import parseError from '../errors/parse-error.js';
import UninstallCommand from '../commands/UninstallCommand.js';
import PingCommand from '../commands/PingCommand.js';
import { arrayContainsAnyOf, isEmpty, no } from './utils.js';
import PathCommand from '../commands/PathCommand.js';
import ScreenshotCommand from '../commands/ScreenshotCommand.js';
import config from '../../config/config.js';

const commandDispatcher = {
  dispatch: async (commandInfo: ICommandInfo) => {
    if (store.hasPackage() && store.shouldShowPkgNotice()) {
      conprint.notice(`Current reference package: ${store.getPackage()}`);
      store.savePkgNoticeTime();
    }

    // If no argument and no options,
    if (no(commandInfo.name)) {
      if (isEmpty(commandInfo.options) || arrayContainsAnyOf(Object.keys(commandInfo.options), ['g', 'j', 'v'])) {
        commandInfo.name = CMD_DEVICES;
        if (config.isDev()) {
          console.log({
            notice: 'No command name entered',
            msg: 'Using default command: "devices"',
          });
        }
      }
    }

    let mainCommand = commandInfo.name;

    switch (true) {
      case /rm\s+/.test(mainCommand):
      case /rmdir\s+/.test(mainCommand):
      case /del\s+/.test(mainCommand):
        return;
    }

    switch (mainCommand) {
      case CMD_DEVICES:
        await new DevicesCommand(commandInfo).run();
        break;

      case CMD_PACKAGES:
      case CMD_PKGS:
        await new ListPackagesCommand(commandInfo).run();
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

      case CMD_IP:
        await new IpCommand(commandInfo).run();
        break;

      case CMD_RESET_SERVER:
        await new ResetServerCommand(commandInfo).run();
        break;

      case CMD_SET_DEFAULT_PACKAGE:
      case CMD_SET_DEFAULT_PKG:
      case CMD_UNSET_DEFAULT_PKG:
      case CMD_UNSET_DEFAULT_PACKAGE:
        await new SetPackageCommand(commandInfo).run();
        break;

      case CMD_UNINSTALL:
        await new UninstallCommand(commandInfo).run();
        break;

      case CMD_PING:
        await new PingCommand(commandInfo).run();
        break;

      case CMD_PATH:
        await new PathCommand(commandInfo).run();
        break;

      case CMD_SCREENSHOT:
      case CMD_SCRSHOT: {
        await new ScreenshotCommand(commandInfo).run();
        break;
      }

      default:
        const cliCommand = await getCommandArgsString();

        if (cliCommand) {
          if (cliCommand === 'shell') {
            conprint.notice(`NOTICE: Run "adb shell" in your terminal`);
            break;
          }

          conprint.info('Running regular adb command...');

          try {
            const shellCmd = `adb ${cliCommand}`;
            const output = await execShellCmd(shellCmd);
            console.log(output);
          } catch (e) {
            conprint.error(parseError(e).message);
          }
        } else {
          // console.log(chalk.red(`No such command: ${mainCommand}`));
        }

        break;
    }
  },
};

export default commandDispatcher;
