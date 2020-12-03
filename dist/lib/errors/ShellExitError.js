"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShellExitError extends Error {
    constructor(code) {
        super(`Exited with code ${code}`);
    }
}
exports.default = ShellExitError;
