"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the arguments passed to the cli command for the calling context.
 */
const getCommandArgsString = () => {
    let command = '';
    process.argv.forEach((entry, i) => {
        if (i > 1) {
            command += entry + ' ';
        }
    });
    return command.replace(/\s+$/, '');
};
exports.default = getCommandArgsString;
