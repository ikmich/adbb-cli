"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceNotConnectedError extends Error {
    constructor() {
        super('No network IP for device. Check that the device is connected to a network');
    }
}
exports.default = DeviceNotConnectedError;
