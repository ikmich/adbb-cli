import BaseCommand from './BaseCommand';
import conprint from '../helpers/conprint';
import execShellCmd from '../helpers/exec-shell-cmd';
import parseError from '../errors/parse-error';
import {wait, yes} from "../helpers/utils";
import getDevices from "../helpers/get-devices";

class ResetServerCommand extends BaseCommand {
  constructor(commandInfo) {
    super(commandInfo);
  }

  async run() {
    await super.run();

    try {
      const devices = await getDevices();
      if (Array.isArray(devices) && devices.length > 0) {
        let d = devices[0];
        // Only run 'adb usb' if usb device is connected
        if (yes(d.usbId)) {
          const output_disconnect = await execShellCmd('adb disconnect');
          conprint.info(output_disconnect);

          const output_usb = await execShellCmd('adb usb');
          conprint.info(output_usb);
        }
      }

      const output_kill_server = await execShellCmd('adb kill-server');
      conprint.info(output_kill_server);

      await wait(200);
      const output_start_server = await execShellCmd('adb start-server');
      conprint.info(output_start_server);
    } catch (e) {
      conprint.error(parseError(e).message);
      return;
    }

    // setTimeout(async () => {
    //   try {
    //     const output2 = await execShellCmd('adb start-server');
    //     conprint.info(output2);
    //   } catch (e) {
    //     conprint.error(parseError(e).message);
    //   }
    // }, 200);
  }
}

export default ResetServerCommand;
