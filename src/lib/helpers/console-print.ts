import chalk = require('chalk');
import {yes} from './utils';

const consolePrint = {
  info: (msg: string) => {
    if (yes(msg)) {
      console.log(chalk.blueBright(msg));
    }
  },
  error: (msg: string | Error) => {
    if (typeof msg === 'string') {
      if (yes(msg)) {
        console.log(chalk.red(msg));
      }
    } else {
      console.log(chalk.red(msg.message));
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
  },
};

export default consolePrint;
