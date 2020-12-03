"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoPackageError extends Error {
    constructor() {
        super('No package');
    }
}
exports.default = NoPackageError;
