import BaseCommand from './BaseCommand.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import conprint from '../helpers/conprint.js';
import { no, yes } from '../helpers/utils.js';
import parseError from '../errors/parse-error.js';

import { ICommandInfo } from '../../types/types.js';

class ListPackagesCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

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
        conprint.info(output);
      } else {
        conprint.notice('No results');
      }
    } catch (e) {
      conprint.error(parseError(e).message);
    }
  }
}

export default ListPackagesCommand;
