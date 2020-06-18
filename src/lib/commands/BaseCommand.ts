import { ICommandOptions } from '../../types/ICommandOptions';
import { ICommandInfo } from '../../types/ICommandInfo';
import execShellCmd from '../helpers/exec-shell-cmd';
import errorParser from '../errors/error-parser';
import ifConcat from '../helpers/if-concat';

class BaseCommand {
    public commandInfo: ICommandInfo;
    protected name: string;
    protected args: string[] = [];
    protected options: ICommandOptions = {
        verbose: false,
    };

    /**
     * Override this in sub class to prevent default printing of error in console
     * */
    protected printError: boolean = true;

    /**
     * Override this in sub class to prevent default printing of output in console
     */
    protected printOutput: boolean = false;

    constructor(commandInfo: ICommandInfo) {
        this.commandInfo = commandInfo;
        this.name = commandInfo.name;
        this.args = commandInfo.args;
        this.options = commandInfo.options;
    }

    async run() {}

    protected async exec(cmd: string): Promise<string> {
        try {
            return await execShellCmd(cmd);
        } catch (e) {
            throw errorParser.parse(e);
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
                s: ` | grep ${this.options.filter}`,
            },
        ]);
    }
}

export default BaseCommand;
