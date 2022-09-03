import execShellCmd from './exec-shell-cmd.js';
import buildAdbCommand from './build-adb-command.js';
import { yes } from './utils.js';
import conprint from './conprint.js';
import parseError from '../errors/parse-error.js';
import config from '../../config/config.js';

const getPackages = async (filter: string, sid?: string): Promise<string[]> => {
  try {
    let results: string[] = [];

    let adbCommand = await buildAdbCommand(`shell pm list packages`, sid);
    if (yes(filter)) {
      adbCommand += ` | ${config.cmd.grep} -i ${filter} || exit 0`;
    }
    let output = await execShellCmd(adbCommand);

    // separate each line with comma
    output = output.replace(/(\n+|\r\n+)/gim, ',');

    // split by comma
    if (/,+/.test(output)) {
      results = output.split(',');
    } else {
      results.push(output);
    }

    results = results.map((line: string) => {
      return line.replace(/^package:/, '');
    });

    return results;
  } catch (e) {
    conprint.error(parseError(e));
    return [];
  }
};

export default getPackages;
