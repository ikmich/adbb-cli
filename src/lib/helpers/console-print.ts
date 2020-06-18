import chalk = require("chalk");

const consolePrint = {
    info: (msg: string) => {
        console.log(chalk.blueBright(msg));
    },
    error: (msg: string) => {
        console.log(chalk.red(msg));
    },
    notice: (msg: string) => {
        console.log(chalk.yellow(msg));
    },
    plain: (msg: string) => {
        console.log(msg);
    },
};

export default consolePrint;