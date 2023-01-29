import { isEmpty, yes } from './utils.js';
import store from './store.js';
import config from '../../config/config.js';
import { devicesCheckWrapper } from './wrappers/devices-check-wrapper.js';

/**
 * Build an adb command.
 * @param argsString The string of options passed to the adb command
 * @param sid The device sid
 */
const buildAdbCommand = async (argsString: string, sid?: string) => {
  let cachedSid = store.getTargetSid();
  if (config.isDev()) {
    console.log({ cachedSid });
  }

  if (!sid) {
    if (yes(cachedSid)) {
      sid = cachedSid;
    }
  }

  let commandString: string = 'adb';

  let isDevicesCmd: boolean = /devices/gi.test(argsString);
  let isDisconnectCmd: boolean = /disconnect/gi.test(argsString);

  if (!isEmpty(sid)) {
    commandString += ` -s ${sid}`;
  } else if (!isDevicesCmd && !isDisconnectCmd) {
    await devicesCheckWrapper((sid) => {
      if (sid) {
        commandString += ` -s ${sid}`;
      }
    });
    // // If multiple devices, show options to select device id
    // const devices: Device[] = await getDevices();
    // if (devices && devices.length > 1) {
    //   conprint.notice('Multiple devices/emulators connected.');
    //
    //   const device = await askSelectDevice();
    //   if (device) {
    //     commandString += ` -s ${device}`;
    //   }
    // }
  }

  commandString += ` ${argsString}`;
  // console.log('>> command:', commandString);
  return commandString;
};

export default buildAdbCommand;
