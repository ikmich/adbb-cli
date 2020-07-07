import BaseCommand from './BaseCommand';
import { ICommandInfo } from '../../types/ICommandInfo';
import { isEmpty, no, yes } from '../helpers/utils';
import askEnterPackage from '../ask/ask-enter-package';
import consolePrint from '../helpers/console-print';
import store from '../helpers/store';
import askInput from '../ask/ask-input';
import parseError from '../errors/parse-error';
import getPackages from '../helpers/get-packages';
import askSelectMultiple from '../ask/ask-select-multiple';

class UninstallCommand extends BaseCommand {
    constructor(commandInfo: ICommandInfo) {
        super(commandInfo);
    }

    async run() {
        let pkg: string = '';
        let pkgs: string[] = [];

        switch (true) {
            case yes(this.options.package):
                pkg = this.options.package!;
                pkgs.push(pkg);
                break;
            case yes(this.args[0]):
                pkg = this.args[0];
                pkgs.push(pkg);
                break;
            case yes(this.options.filter):
                // Let user select from packages that match the filter...
                const packages = await getPackages(this.options.filter!);
                // pkg = await askSelect('package', 'Select package', packages);
                pkgs = await askSelectMultiple('package', 'Select package', packages);
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
            for (let pkg of pkgs) {
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
}

export default UninstallCommand;
