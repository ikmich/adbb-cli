import { ICommandOptions } from '../../types/ICommandOptions';
import { ICommandInfo } from '../../types/ICommandInfo';
import execShellCmd from '../helpers/exec-shell-cmd';
import ifConcat from '../helpers/if-concat';
import parseError from '../errors/parse-error';
import config from '../../config/config';
import { no } from '../helpers/utils';

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

  async run() {}

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
