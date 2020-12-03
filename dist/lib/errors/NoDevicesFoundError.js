"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoDevicesFoundError extends Error {
    constructor(e) {
        super('No devices/emulators found. Please connect your device via USB and ensure that USB Debugging is enabled');
        this.name = e.name;
        this.stack = e.stack;
    }
}
exports.default = NoDevicesFoundError;
