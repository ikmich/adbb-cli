"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UndefinedNetworkConfigError extends Error {
    constructor() {
        super('Undefined network config');
    }
}
exports.default = UndefinedNetworkConfigError;
