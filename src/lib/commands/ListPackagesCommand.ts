import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import buildAdbCommand from "../helpers/build-adb-command";
import consolePrint from "../helpers/console-print";
import {yes} from "../helpers/utils";
import parseError from "../errors/parseError";

class ListPackagesCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        let shellCmd = await buildAdbCommand('shell pm list packages', this.options.sid);
        shellCmd = this.applyFilter(shellCmd);

        try {
            const output = await this.exec(shellCmd);
            if (yes(output)) {
                consolePrint.info(output);
            } else {
                consolePrint.error('NO RESULTS!');
            }
        } catch (e) {
            consolePrint.error(parseError(e).message);
        }
    }
}

export default ListPackagesCommand;
