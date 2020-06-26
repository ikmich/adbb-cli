import BaseCommand from './BaseCommand';
import { ICommandInfo } from '../../types/ICommandInfo';
import { yes } from '../helpers/utils';
import askEnterPackage from '../ask/ask-enter-package';
import consolePrint from '../helpers/console-print';

class UninstallCommand extends BaseCommand {
    constructor(commandInfo: ICommandInfo) {
        super(commandInfo);
    }

    async run(): Promise<any> {
        let pkg: string = '';

        switch (true) {
            case yes(this.options.package):
                pkg = this.options.package!;
                break;
            case yes(this.args[0]):
                pkg = this.args[0];
                break;
            default:
                pkg = await askEnterPackage();
                break;
        }

        if (yes(pkg)) {
            try {
                const output = await this.exec(`adb uninstall ${pkg}`);
                consolePrint.info(output);
            } catch (e) {}
        }
    }
}

export default UninstallCommand;
