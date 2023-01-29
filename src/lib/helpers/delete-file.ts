import { devicesCheckWrapper } from './wrappers/devices-check-wrapper.js';
import { _fn } from './utils.js';
import execShellCmd from './exec-shell-cmd.js';
import conprint from './conprint.js';

/**
 * Delete a file from the device. Specify the path to the file to be deleted. Please use this carefully, as files
 * are deleted permanently!
 * @param filepath
 */
export async function deleteFile(filepath: string) {
  return new Promise<string | null>(async (resolve, reject) => {

    await devicesCheckWrapper(async (device: string | null) => {
      try {
        const deviceSidSwitchFlag: string = _fn(() => {
          if (device) {
            return `-s ${device}`;
          } else {
            return '';
          }
        });

        const cmdDelete: string = `adb ${deviceSidSwitchFlag} shell rm ${filepath}`;
        const result: string = await execShellCmd(cmdDelete);

        console.log(`${filepath} successfully deleted from device.`);
        resolve(result);
      } catch (e) {
        conprint.error(`Error deleting recording file at ${filepath}`);
        conprint.error(e);
        reject(e);
      }
    });

  });
}