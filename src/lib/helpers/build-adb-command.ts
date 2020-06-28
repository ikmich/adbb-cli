import getDevices from './get-devices';
import askSelectDevice from '../ask/ask-select-device';
import Device from "../core/Device";
import chalk = require('chalk');

const buildAdbCommand = async (optsString: string, sid: string = '') => {
    let commandString = 'adb';

    let flag_devices: boolean = /devices/gi.test(optsString);
    let flag_disconnect: boolean = /disconnect/gi.test(optsString);

    if (sid && sid.trim() !== '') {
        commandString += ` -s ${sid}`;
    } else if (!flag_devices && !flag_disconnect) {
        // If multiple devices, show options to select device id
        const devices: Device[] = await getDevices();
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
