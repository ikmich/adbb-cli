import { ICommandOptions } from '../../types/ICommandOptions';
import { ICommandInfo } from '../../types/ICommandInfo';
import execShellCmd from '../helpers/exec-shell-cmd';
import ifConcat from '../helpers/if-concat';
import parseError from '../errors/parse-error';
import config from '../../config/config';
import { no, yes } from '../helpers/utils';
import store from '../helpers/store';
import getDevices from '../helpers/get-devices';
import Device from '../core/Device';
import askSelectDevice from '../ask/ask-select-device';
import conprint from '../helpers/conprint';
import { CMD_SET_PACKAGE, CMD_SET_PKG, CMD_UNSET_PACKAGE, CMD_UNSET_PKG } from '../../command-constants';

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
      if (no(this.options.filter) && config.filterDirectiveRegex.test(arg)) {
        // => Filter directive used for this arg. Use this as the filter.
        this.options.filter = arg.replace(config.filterDirectiveRegex, '');
        break;
      }
    }
  }

  isDisconnectAction() {
    const has_disconnect_arg = this.args.some(arg => {
      return arg === 'disconnect';
    });

    const has_disconnect_option = yes(this.options.disconnect);
    return has_disconnect_arg || has_disconnect_option;
  }

  async isSidRequired() {
    const is_devices_command = this.name === 'devices';
    const is_disconnect_action = this.isDisconnectAction();
    const is_set_pkg = [CMD_SET_PACKAGE, CMD_SET_PKG].includes(this.name);
    const is_unset_pkg = [CMD_UNSET_PACKAGE, CMD_UNSET_PKG].includes(this.name);

    return !is_devices_command && !is_disconnect_action && !is_set_pkg && !is_unset_pkg;
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

  done() {
    store.clearTargetSid();
  }

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
