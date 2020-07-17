"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DifferentNetworksError extends Error {
    constructor() {
        super('Device and host are not on the same network');
    }
}
exports.default = DifferentNetworksError;
