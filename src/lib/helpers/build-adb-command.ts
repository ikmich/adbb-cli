import getDevices from './get-devices';
import {DeviceInfo} from '../../types/DeviceInfo.type';
import askSelectDevice from "../ask/ask-select-device";
import chalk = require('chalk');

const buildAdbCommand = async (optsString: string, sid: string = '') => {
    let commandString = 'adb';

    if (sid && sid.trim() !== '') {
        commandString += ` -s ${sid}`;
    } else if (!optsString.includes('devices') && !optsString.includes('disconnect')) {
        // If multiple devices, show options to select device id
        const devices: DeviceInfo[] = await getDevices();
        if (devices && devices.length > 1) {
            console.log(chalk.yellow('Multiple devices/emulators connected.'));

            const device = await askSelectDevice();
            if (device) {
                commandString += ` -s ${device}`;
            }
        }
    }

    commandString += ` ${optsString}`;
    // console.log('>> command:', commandString);
    return commandString;
};

export default buildAdbCommand;
