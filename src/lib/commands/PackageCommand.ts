import BaseCommand from './BaseCommand';
import { yes } from '../helpers/utils';
import conprint from '../helpers/conprint';
import askEnterPackage from '../ask/ask-enter-package';
import store from '../helpers/store';
import { CMD_UNSET_PACKAGE, CMD_UNSET_PKG } from '../../command-constants';
import parseError from '../errors/parse-error';
import chalk = require('chalk');

class PackageCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  private static unsetPkg() {
    store.unsetPackage();
    conprint.info('Reference package has been unset');
  }

  async run() {
    switch (this.name) {
      case CMD_UNSET_PACKAGE:
      case CMD_UNSET_PKG:
        store.unsetPackage();
        PackageCommand.unsetPkg();
        return;
    }

    switch (true) {
      case this.options.unset:
      case this.options.disconnect:
        PackageCommand.unsetPkg();
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

export default PackageCommand;
