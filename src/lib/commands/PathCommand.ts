import BaseCommand from './BaseCommand';
import conprint from '../helpers/conprint';
import parseError from '../errors/parse-error';
import buildAdbCommand from '../helpers/build-adb-command';
import { isEmpty, no, yes } from '../helpers/utils';
import store from '../helpers/store';
import askInput from '../ask/ask-input';
import askSelectPackage from '../ask/ask-select-package';

class PathCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    this.checkResolveArgFilter();

    try {
      let pkgs: string[] = [];
      let pkg = '';

      switch (true) {
        case store.hasPackage(): {
          const answer: string = await askInput('confirm', `Show install path for: "${store.getPackage()}"? (y/n)`);

          if (yes(answer) && answer.toLowerCase() === 'y') {
            pkg = store.getPackage();
            pkgs.push(pkg);
          }
          break;
        }

        case yes(this.options.filter):
          pkgs = await askSelectPackage(this.options.filter!, this.options.sid);
          break;

        case yes(!this.isArg1AFilterDirective() && this.args[0]): {
          pkg = this.args[0];
          pkgs.push(pkg);
          break;
        }

        case yes(this.options.package): {
          pkg = this.options.package!;
          pkgs.push(pkg);
          break;
        }

        default: {
          // Check if filter directive is used
          break;
        }
      }

      if (isEmpty(pkgs)) {
        conprint.notice('No package found');
        return;
      }

      let i = 0;
      for (let pkg of pkgs) {
        conprint.plain(`Running ${++i} of ${pkgs.length}`);
        let adbCmdString = `shell pm path ${pkg}`;
        let shellCmd = await buildAdbCommand(adbCmdString, this.options.sid);
        const output = await this.exec(shellCmd);
        conprint.info(output);
      }
      conprint.info('DONE');
    } catch (e) {
      conprint.error(parseError(e).message);
      return;
    }
  }
}

export default PathCommand;
