import BaseCommand from './BaseCommand';
import buildAdbCommand from '../helpers/build-adb-command';
import askEnterPackage from '../ask/ask-enter-package';
import NoPackageError from '../errors/NoPackageError';
import { isEmpty, yes } from '../helpers/utils';
import conprint from '../helpers/conprint';
import store from '../helpers/store';
import askSelectPackage from '../ask/ask-select-package';

class ClearCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    this.checkResolveArgFilter();

    let pkgs: string[] = [];

    switch (true) {
      case yes(this.options.package):
        pkgs.push(this.options.package!);
        break;

      case yes(this.options.filter):
        pkgs = await askSelectPackage(this.options.filter!);
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
