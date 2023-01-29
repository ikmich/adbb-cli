import BaseCommand from './BaseCommand.js';
import { yes } from '../helpers/utils.js';
import conprint from '../helpers/conprint.js';
import askEnterPackage from '../ask/ask-enter-package.js';
import store from '../helpers/store.js';
import { CMD_UNSET_DEFAULT_PACKAGE, CMD_UNSET_DEFAULT_PKG } from '../../command-constants.js';
import parseError from '../errors/parse-error.js';
import chalk from 'chalk';

import { ICommandInfo } from '../../types/types.js';

/**
 * Set a package that should be used in future commands.
 */
class SetPackageCommand extends BaseCommand {
  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
  }

  private static unsetPkg() {
    store.unsetPackage();
    conprint.info('Reference package has been unset');
  }

  async run() {
    await super.run();

    switch (this.name) {
      case CMD_UNSET_DEFAULT_PACKAGE:
      case CMD_UNSET_DEFAULT_PKG:
        store.unsetPackage();
        SetPackageCommand.unsetPkg();
        return;
    }

    switch (true) {
      case this.options.unset:
      case this.options.disconnect:
        SetPackageCommand.unsetPkg();
        return;
    }

    let packageName: string | any = null;

    switch (true) {
      case yes(this.args[0]):
        packageName = this.args[0];
        break;
      case store.hasPackage():
        // Show current package
        console.log(`Reference package: ${chalk.blueBright(store.getPackage())}`);
        break;
      default:
        // Ask to enter the reference package.
        packageName = await askEnterPackage('Set reference package e.g com.package.app:');
        break;
    }

    if (yes(packageName)) {
      try {
        store.setPackage(packageName);
        conprint.info(`${packageName} is now the default package`);
      } catch (e) {
        conprint.error(parseError(e).message);
      }
    }
  }
}

export default SetPackageCommand;
