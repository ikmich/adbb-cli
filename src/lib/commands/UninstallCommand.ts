import BaseCommand from './BaseCommand';
import { ICommandInfo } from '../../types/ICommandInfo';
import { no, yes } from '../helpers/utils';
import askEnterPackage from '../ask/ask-enter-package';
import consolePrint from '../helpers/console-print';
import store from '../helpers/store';
import askInput from '../ask/ask-input';
import parseError from '../errors/parse-error';

class UninstallCommand extends BaseCommand {
    constructor(commandInfo: ICommandInfo) {
        super(commandInfo);
    }

    async run() {
        let pkg: string = '';

        switch (true) {
            case yes(this.options.package):
                pkg = this.options.package!;
                break;
            case yes(this.args[0]):
                pkg = this.args[0];
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
                    }
                }

                if (no(pkg)) {
                    pkg = await askEnterPackage();
                }

                break;
        }

        if (yes(pkg)) {
            try {
                const output = await this.exec(`adb uninstall ${pkg}`);
                consolePrint.info(output);
            } catch (e) {
                e = parseError(e);
                consolePrint.error(e.message);
            }
        }
    }
}

export default UninstallCommand;
