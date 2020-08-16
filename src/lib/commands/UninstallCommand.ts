import BaseCommand from './BaseCommand';
import { ICommandInfo } from '../../types/ICommandInfo';
import { isEmpty, no, yes } from '../helpers/utils';
import askEnterPackage from '../ask/ask-enter-package';
import consolePrint from '../helpers/console-print';
import store from '../helpers/store';
import askInput from '../ask/ask-input';
import parseError from '../errors/parse-error';
import askSelectPackage from '../ask/ask-select-package';
import buildAdbCommand from '../helpers/build-adb-command';

class UninstallCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    this.checkResolveArgFilter();
    let pkg: string = '';
    let pkgs: string[] = [];

    switch (true) {
      case yes(this.options.package):
        pkg = this.options.package!;
        pkgs.push(pkg);
        break;

      case yes(this.options.filter):
        pkgs = await askSelectPackage(this.options.filter!);
        break;

      case yes(this.args[0]):
        pkg = this.args[0];
        pkgs.push(pkg);
        break;

      default:
        // Check if a reference package has previously been set
        if (store.hasPackage()) {
          const answer: string = await askInput(
            'confirm',
            `This application: "${store.getPackage()}" will be uninstalled. WOULD YOU LIKE TO CONTINUE? (y/n)`,
          );
          if (yes(answer) && answer.toLowerCase() === 'y') {
            pkg = store.getPackage();
            pkgs.push(pkg);
          }
        }

        if (no(pkg)) {
          pkg = await askEnterPackage();
          pkgs.push(pkg);
        }

        break;
    }

    if (!isEmpty(pkgs)) {
      let i = 0;
      for (let pkg of pkgs) {
        try {
          consolePrint.plain(`Running ${++i} of ${pkgs.length}...`);

          let adbCmdString = `uninstall ${pkg}`;
          let shellCmd = await buildAdbCommand(adbCmdString, this.options.sid);
          const output = await this.exec(shellCmd);
          consolePrint.info(output);
        } catch (e) {
          e = parseError(e);
          consolePrint.error(e.message);
        }
      }
      consolePrint.info('DONE');
    }
  }
}

export default UninstallCommand;
