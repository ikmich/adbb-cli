import {CommandOptionsType} from '../../types/CommandOptions.type';
import {CommandInfo} from "../../types/CommandInfo.type";
import runShellCmd from "../helpers/run-shell-cmd";
import errorParser from "../errors/error-parser";

class BaseCommand {

    public commandInfo: CommandInfo;
    protected name: string;
    protected args: string[] = [];
    protected options: CommandOptionsType = {
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

    constructor(commandInfo: CommandInfo) {
        this.commandInfo = commandInfo;
        this.name = commandInfo.name;
        this.args = commandInfo.args;
        this.options = commandInfo.options;
    }

    async run() {
    }

    protected async exec(cmd: string): Promise<string> {
        try {
            return await runShellCmd(cmd);
        } catch (e) {
            throw errorParser.parse(e);
        }
    }
}

export default BaseCommand;
