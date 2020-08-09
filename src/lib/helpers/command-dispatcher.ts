import {ICommandInfo} from '../../types/ICommandInfo';
import WifiCommand from '../commands/WifiCommand';
import DevicesCommand from '../commands/DevicesCommand';
import ListPackagesCommand from '../commands/ListPackagesCommand';
import getCliCommandString from './get-cli-command-string';
import ClearCommand from '../commands/ClearCommand';
import execShellCmd from './exec-shell-cmd';
import LaunchEmulatorCommand from '../commands/LaunchEmulatorCommand';
import IpCommand from '../commands/IpCommand';
import ResetServerCommand from '../commands/ResetServerCommand';
import {
    CMD_CLEAR,
    CMD_DEVICES,
    CMD_EMU,
    CMD_EMULATOR,
    CMD_IP,
    CMD_PACKAGE,
    CMD_PACKAGES,
    CMD_PATH,
    CMD_PING,
    CMD_PKG,
    CMD_PKGS,
    CMD_RESET_SERVER,
    CMD_UNINSTALL,
    CMD_UNSET_PACKAGE,
    CMD_UNSET_PKG,
    CMD_WIFI,
} from '../../command-constants';
import consolePrint from './console-print';
import PackageCommand from '../commands/PackageCommand';
import store from './store';
import parseError from '../errors/parse-error';
import UninstallCommand from '../commands/UninstallCommand';
import PingCommand from '../commands/PingCommand';
import {arrayContainsAnyOf, isEmpty, no} from './utils';
import PathCommand from "../commands/PathCommand";

const commandDispatcher = {
  dispatch: async (commandInfo: ICommandInfo) => {
    if (store.hasPackage() && store.shouldShowPkgNotice()) {
      consolePrint.notice(`Current reference package: ${store.getPackage()}`);
      store.savePkgNoticeTime();
    }

    // If no argument and no options,
    if (no(commandInfo.name)) {
      if (isEmpty(commandInfo.options) || arrayContainsAnyOf(Object.keys(commandInfo.options), ['g', 'j', 'v'])) {
        commandInfo.name = CMD_DEVICES;
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

      case CMD_PACKAGE:
      case CMD_PKG:
        await new PackageCommand(commandInfo).run();
        break;

      case CMD_UNSET_PKG:
      case CMD_UNSET_PACKAGE:
        await new PackageCommand(commandInfo).run();
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

      default:
        const cliCommand = await getCliCommandString();

        if (cliCommand) {
          if (cliCommand === 'shell') {
            consolePrint.notice(`NOTICE: Run "adb shell" in your terminal`);
            break;
          }

          consolePrint.info('Running regular adb command...');

          try {
            const shellCmd = `adb ${cliCommand}`;
            const output = await execShellCmd(shellCmd);
            console.log(output);
          } catch (e) {
            consolePrint.error(parseError(e).message);
          }
        } else {
          // console.log(chalk.red(`No such command: ${mainCommand}`));
        }

        break;
    }
  },
};

export default commandDispatcher;
