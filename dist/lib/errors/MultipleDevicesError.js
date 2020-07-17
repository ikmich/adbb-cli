"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultipleDevicesError extends Error {
    constructor(e) {
        super('More than one device/emulator');
        this.name = e.name;
        this.stack = e.stack;
    }
}
exports.default = MultipleDevicesError;
