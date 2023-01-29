import execShellCmd from '../helpers/exec-shell-cmd.js';
import ifConcat from '../helpers/if-concat.js';
import parseError from '../errors/parse-error.js';
import config from '../../config/config.js';
import { no, yes } from '../helpers/utils.js';
import store from '../helpers/store.js';
import getDevices from '../helpers/get-devices.js';
import Device from '../core/Device.js';
import askSelectDevice from '../ask/ask-select-device.js';
import conprint from '../helpers/conprint.js';
import {
  CMD_SET_DEFAULT_PACKAGE,
  CMD_SET_DEFAULT_PKG,
  CMD_UNSET_DEFAULT_PACKAGE,
  CMD_UNSET_DEFAULT_PKG,
} from '../../command-constants.js';
import { ICommandInfo, ICommandOptions } from '../../types/types.js';

class BaseCommand {
  public commandInfo: ICommandInfo;
  protected name: string;
  protected args: string[] = [];
  protected options: ICommandOptions = {
    verbose: false,
  };

  constructor(commandInfo: ICommandInfo) {
    this.commandInfo = commandInfo;
    this.name = commandInfo.name;
    this.args = commandInfo.args;
    this.options = commandInfo.options;
  }

  getArg1(): string {
    return this.args[0] || '';
  }

  isArg1AFilterDirective() {
    if (this.getArg1() !== null) {
      return config.filterDirectiveRegex.test(this.getArg1());
    }
  }

  /**
   * Resolves argument filters for the case where a filter directive is used.
   * @protected
   */
  protected checkResolveArgFilter() {
    for (let arg of this.args) {
      let argIsFilter = config.filterDirectiveRegex.test(arg);
      if (no(this.options.filter) && argIsFilter) {
        // => Filter directive used for this arg. Use this to set the value of filter arg.
        this.options.filter = arg.replace(config.filterDirectiveRegex, '');
        break;
      }
    }
  }

  isDisconnectAction() {
    const hasDisconnectArg = this.args.some((arg) => {
      return arg === 'disconnect';
    });

    const hasDisconnectOption = yes(this.options.disconnect);
    return hasDisconnectArg || hasDisconnectOption;
  }

  async isSidRequired() {
    const isDevicesCommand = this.name === 'devices';
    const isDisconnectAction = this.isDisconnectAction();
    const isSetPkg = [CMD_SET_DEFAULT_PACKAGE, CMD_SET_DEFAULT_PKG].includes(this.name);
    const isUnsetPkg = [CMD_UNSET_DEFAULT_PACKAGE, CMD_UNSET_DEFAULT_PKG].includes(this.name);

    return !isDevicesCommand && !isDisconnectAction && !isSetPkg && !isUnsetPkg;
  }

  /**
   * Executes actions to run the command. If multiple devices are connected, the base implementation handles logic
   * to obtain the target device to be used for the current command execution path. Hence it is strongly advised that
   * any implementing subclass calls `super.run()` before executing other actions.
   */
  async run() {
    let targetSid: any = '';

    if (no(this.options.sid)) {
      const devices: Device[] = await getDevices();

      if (devices.length > 1) {
        if (await this.isSidRequired()) {
          conprint.notice('Multiple devices/emulators connected.');
          targetSid = await askSelectDevice();
        }
      } else {
        targetSid = this.options.sid;
      }
    }

    if (yes(targetSid)) {
      store.saveTargetSid(targetSid);
    } else {
      store.clearTargetSid();
    }
  }

  // done() {
  //   store.clearTargetSid();
  // }

  protected async exec(cmd: string): Promise<string> {
    try {
      return await execShellCmd(cmd);
    } catch (e) {
      throw parseError(e);
    }
  }

  /**
   * Use to filter the command output. Should be called AFTER the other command options have been applied to the
   * string.
   * @param cmd
   */
  protected applyFilter(cmd: string): string {
    return ifConcat(cmd, [
      {
        c: typeof this.options.filter !== 'undefined' && this.options.filter !== null,
        s: ` | ${config.cmd.grep} "${this.options.filter}" || exit 0`,
      },
    ]);
  }
}

export default BaseCommand;
