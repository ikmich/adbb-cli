"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HostNotConnectedError extends Error {
    constructor() {
        super('No IP for host. Check that the computer is connected to a network');
    }
}
exports.default = HostNotConnectedError;
