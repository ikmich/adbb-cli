import BaseCommand from './BaseCommand.js';
import { isEmpty, no, yes } from '../helpers/utils.js';
import askEnterPackage from '../ask/ask-enter-package.js';
import conprint from '../helpers/conprint.js';
import store from '../helpers/store.js';
import askInput from '../ask/ask-input.js';
import parseError from '../errors/parse-error.js';
import askSelectPackage from '../ask/ask-select-package.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import { ICommandInfo } from '../../types/types.js';

/**
 * Command to uninstall an installed package.
 */
class UninstallCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    this.checkResolveArgFilter();
    let pkg: string = '';
    let pkgs: string[] = [];

    switch (true) {
      case yes(this.options.package):
        pkg = this.options.package!;
        pkgs.push(pkg);
        break;

      case yes(this.options.filter):
        pkgs = await askSelectPackage(this.options.filter!, this.options.sid);
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
            pkg = store.getPackage() as string;
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
          conprint.plain(`Running ${++i} of ${pkgs.length}...`);

          let adbCmdString = `uninstall ${pkg}`;
          let shellCmd = await buildAdbCommand(adbCmdString, this.options.sid);
          const output = await this.exec(shellCmd);
          conprint.info(output);
        } catch (e) {
          e = parseError(e);
          conprint.error(e.message);
        }
      }
      conprint.info('DONE');
    }
  }
}

export default UninstallCommand;
