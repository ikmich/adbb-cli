import chalk = require('chalk');
import { yes } from './utils';

const consolePrint = {
    info: (msg: string) => {
        if (yes(msg)) {
            console.log(chalk.blueBright(msg));
        }
    },
    error: (msg: string) => {
        if (yes(msg)) {
            console.log(chalk.red(msg));
        }
    },
    notice: (msg: string) => {
        if (yes(msg)) {
            console.log(chalk.yellow(msg));
        }
    },
    success: (msg: string) => {
        if (yes(msg)) {
            console.log(chalk.greenBright(msg));
        }
    },
    plain: (msg: string) => {
        if (yes(msg)) {
            console.log(msg);
        }
    }
};

export default consolePrint;
