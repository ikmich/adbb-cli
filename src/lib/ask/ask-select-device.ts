import getDevices from '../helpers/get-devices.js';
import inquirer from 'inquirer';
import Device from '../core/Device.js';

/**
 * Ask the user to select a device, and return the selected device's sid.
 */
const askSelectDevice = async () => {
  const promptKey = 'device';

  const devices: Device[] = await getDevices();
  if (devices && devices.length > 1) {
    const deviceIds: string[] = devices.map((deviceInfo: Device) => {
      if (deviceInfo.isEmulator()) {
        return `emulator-${deviceInfo.sid}`;
      }
      return deviceInfo.sid;
    });

    const answer = await inquirer.prompt({
      type: 'list',
      name: promptKey,
      message: 'Select preferred device:',
      choices: deviceIds,
    });

    return answer[promptKey];
  }
};

export default askSelectDevice;
