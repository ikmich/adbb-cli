import Device from '../../core/Device.js';
import getDevices from '../get-devices.js';
import conprint from '../conprint.js';
import askSelectDevice from '../../ask/ask-select-device.js';

/**
 * Use this to wrap a callback function within an async operation that asks the user to select a preferred device in
 * the event that there is more than one device connected. The selected device sid is passed as an argument to the
 * callback function. If there is only one device, an empty string is passed to the callback function.
 * @param cb
 */
export async function devicesCheckWrapper(cb: (deviceSid: string | null) => any) {
  // If multiple devices, show options to select device id
  const devices: Device[] = await getDevices();
  if (Array.isArray(devices)) {
    if (devices.length > 1) {
      conprint.notice('Multiple devices/emulators connected.');

      const deviceSid = await askSelectDevice();
      cb(deviceSid);
    } else if (devices.length == 1) {
      /* If only one device, no need to specify the device sid. */
      cb('');

      // const device = devices[0];
      // let sid = device.sid;
      // if (device.isEmulator()) {
      //   sid = `emulator-${sid}`;
      // }
      // cb(sid);
    }
  }
}