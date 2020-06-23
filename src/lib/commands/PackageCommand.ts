import BaseCommand from './BaseCommand';
import { yes } from '../helpers/utils';
import consolePrint from '../helpers/console-print';
import askEnterPackage from '../ask/ask-enter-package';
import errorParser from '../errors/error-parser';
import store from '../../config/store';
import chalk = require('chalk');
import { CMD_UNSET_PACKAGE, CMD_UNSET_PKG } from '../../command-constants';

class PackageCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    private static unsetPkg() {
        store.unsetPackage();
        consolePrint.info('Saved reference package has been unset');
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

        if (yes(this.args[0])) {
            packageName = this.args[0];
        } else if (store.hasPackage()) {
            // Show current package
            console.log(`Reference package: ${chalk.blueBright(store.getPackage())}`);
        } else {
            // Ask to enter the reference package.
            packageName = await askEnterPackage('Set reference package e.g com.package.app:');
        }

        if (yes(packageName)) {
            try {
                store.setPackage(packageName);
                consolePrint.info(`${packageName} is now the default package`);
            } catch (e) {
                consolePrint.error(errorParser.parse(e).message);
            }
        }
    }
}

export default PackageCommand;
