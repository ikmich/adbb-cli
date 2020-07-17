"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCliCommandString = () => {
    let command = '';
    process.argv.forEach((entry, i) => {
        if (i > 1) {
            command += entry + ' ';
        }
    });
    return command.replace(/\s+$/, '');
};
exports.default = getCliCommandString;
