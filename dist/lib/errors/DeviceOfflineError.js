"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeviceOfflineError extends Error {
    constructor(e) {
        super('Device offline');
        this.name = e.name;
        this.stack = e.stack;
    }
}
exports.default = DeviceOfflineError;
