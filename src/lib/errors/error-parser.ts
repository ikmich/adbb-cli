import DeviceOfflineError from "./DeviceOfflineError";
import MultipleDevicesError from "./MultipleDevicesError";
import NoDevicesFoundError from "./NoDevicesFoundError";

const errorParser = {
    parse(e:Error): Error {
        if (e.message.toLowerCase().includes('device offline')) {
            return new DeviceOfflineError(e);
        }

        if (e.message.toLowerCase().includes('more than one device/emulator')) {
            return new MultipleDevicesError(e);
        }

        if (e.message.toLowerCase().includes('no devices/emulators found')) {
            return new NoDevicesFoundError(e);
        }

        return e;
    }
};

export default errorParser;