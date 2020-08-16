import BaseCommand from './BaseCommand';
import buildAdbCommand from '../helpers/build-adb-command';
import consolePrint from '../helpers/console-print';
import { no, yes } from '../helpers/utils';
import parseError from '../errors/parse-error';

class ListPackagesCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    let shellCmd = await buildAdbCommand('shell pm list packages', this.options.sid);

    if (no(this.options.filter)) {
      // The first command is the package filter
      let filterArg = this.args[0];
      if (yes(filterArg)) {
        // Remove filter directive if exists
        filterArg = filterArg.replace(/^[:*]+/, '');
        this.options.filter = filterArg;
      }
    }

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
