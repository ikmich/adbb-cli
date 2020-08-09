import execShellCmd from './exec-shell-cmd';
import buildAdbCommand from './build-adb-command';
import {yes} from './utils';
import consolePrint from './console-print';
import parseError from '../errors/parse-error';
import config from "../../config/config";

const getPackages = async (filter: string): Promise<string[]> => {
  try {
    let results: string[] = [];

    let adbCommand = await buildAdbCommand(`shell pm list packages`);
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
    consolePrint.error(parseError(e));
    return [];
  }
};

export default getPackages;
