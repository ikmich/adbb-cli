"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const utils_1 = require("./utils");
const consolePrint = {
    info: (msg) => {
        if (utils_1.yes(msg)) {
            console.log(chalk.blueBright(msg));
        }
    },
    error: (msg) => {
        if (typeof msg === 'string') {
            if (utils_1.yes(msg)) {
                console.log(chalk.red(msg));
            }
        }
        else {
            console.log(chalk.red(msg.message));
        }
    },
    notice: (msg) => {
        if (utils_1.yes(msg)) {
            console.log(chalk.yellow(msg));
        }
    },
    success: (msg) => {
        if (utils_1.yes(msg)) {
            console.log(chalk.greenBright(msg));
        }
    },
    plain: (msg) => {
        if (utils_1.yes(msg)) {
            console.log(msg);
        }
    },
};
exports.default = consolePrint;
