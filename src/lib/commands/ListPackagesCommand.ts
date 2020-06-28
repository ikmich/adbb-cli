import BaseCommand from './BaseCommand';
import buildAdbCommand from '../helpers/build-adb-command';
import consolePrint from '../helpers/console-print';
import { yes } from '../helpers/utils';
import parseError from '../errors/parse-error';

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
                consolePrint.notice('No results');
            }
        } catch (e) {
            consolePrint.error(parseError(e).message);
        }
    }
}

export default ListPackagesCommand;
