import getDevices from "../helpers/get-devices";
import inquirer from 'inquirer';
import Device from "../core/Device";

const askSelectDevice = async () => {
  const devices: Device[] = await getDevices();
  if (devices && devices.length > 1) {
    const deviceIds = devices.map(deviceInfo => {
      return deviceInfo.sid;
    });

    const answer = await inquirer.prompt({
      type: 'list',
      name: 'device',
      message: 'Select preferred device:',
      choices: deviceIds,
    });

    return answer.device;
  }
};

export default askSelectDevice;