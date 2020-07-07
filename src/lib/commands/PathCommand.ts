import BaseCommand from './BaseCommand';
import consolePrint from '../helpers/console-print';
import parseError from '../errors/parse-error';
import buildAdbCommand from '../helpers/build-adb-command';
import { no, yes } from '../helpers/utils';
import store from '../helpers/store';
import askInput from '../ask/ask-input';

class PathCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
    }

    async run() {
        try {
            let pkg = '';

            switch (true) {
                case store.hasPackage():
                    const answer: string = await askInput(
                        'confirm',
                        `Show install path for: "${store.getPackage()}"? (y/n)`,
                    );

                    if (yes(answer) && answer.toLowerCase() === 'y') {
                        pkg = store.getPackage();
                    }
                    break;
                case yes(this.args[0]):
                    pkg = this.args[0];
                    break;
                case yes(this.options.package):
                    pkg = this.options.package!;
                    break;
            }

            if (no(pkg)) {
                consolePrint.error('No package specified');
                return;
            }

            let cmd = await buildAdbCommand(`shell pm path ${pkg}`);
            const output = await this.exec(cmd);
            consolePrint.info(output);
        } catch (e) {
            consolePrint.error(parseError(e).message);
            return;
        }
    }
}

export default PathCommand;
