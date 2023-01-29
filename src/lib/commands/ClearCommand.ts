import BaseCommand from './BaseCommand.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import askEnterPackage from '../ask/ask-enter-package.js';
import NoPackageError from '../errors/NoPackageError.js';
import { isEmpty, yes } from '../helpers/utils.js';
import conprint from '../helpers/conprint.js';
import store from '../helpers/store.js';
import askSelectPackage from '../ask/ask-select-package.js';

import { ICommandInfo } from '../../types/types.js';

/**
 * Command to clear an app's data.
 */
class ClearCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    this.checkResolveArgFilter();

    let pkgs: string[] = [];

    switch (true) {
      case yes(this.options.package):
        pkgs.push(this.options.package!);
        break;

      case yes(this.options.filter):
        pkgs = await askSelectPackage(this.options.filter!, this.options.sid);
        break;

      case yes(this.args[0]):
        pkgs.push(this.args[0]);
        break;

      default:
        // Check if a reference package has previously been set
        if (store.hasPackage()) {
          const pkg = store.getPackage();
          pkgs.push(pkg);
        } else {
          // Request for package
          const pkg = await askEnterPackage();
          if (yes(pkg) && pkg.trim() !== '') {
            pkgs.push(pkg);
          } else {
            throw new NoPackageError();
          }
        }

        break;
    }

    try {
      if (!isEmpty(pkgs)) {
        let i = 0;
        for (let pkg of pkgs) {
          conprint.plain(`Running ${++i} of ${pkgs.length}`);
          let adbCmdString = `shell pm clear ${pkg}`;
          let shellCmd = await buildAdbCommand(adbCmdString, this.options.sid);
          const output = await this.exec(shellCmd);
          conprint.info(output);
        }
        conprint.info('DONE');
      }
    } catch (e) {
      conprint.error(e.message);
    }
  }
}

export default ClearCommand;
