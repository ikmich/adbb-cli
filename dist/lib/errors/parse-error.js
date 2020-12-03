"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DeviceOfflineError_1 = __importDefault(require("./DeviceOfflineError"));
const MultipleDevicesError_1 = __importDefault(require("./MultipleDevicesError"));
const NoDevicesFoundError_1 = __importDefault(require("./NoDevicesFoundError"));
const parseError = (e) => {
    if (typeof e === 'string') {
        e = new Error(e);
    }
    if (e && e.message) {
        // if (e.message.toLowerCase().includes('command failed')) {
        //   return new Error('Command failed');
        // }
        if (e.message.toLowerCase().includes('device offline')) {
            return new DeviceOfflineError_1.default(e);
        }
        if (e.message.toLowerCase().includes('more than one device/emulator')) {
            return new MultipleDevicesError_1.default(e);
        }
        if (e.message.toLowerCase().includes('no devices/emulators found')) {
            return new NoDevicesFoundError_1.default(e);
        }
    }
    return e;
};
exports.default = parseError;
