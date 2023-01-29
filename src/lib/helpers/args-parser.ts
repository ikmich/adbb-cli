import config from '../../config/config.js';

import { ICommandInfo } from '../../types/types.js';

const argsParser = {
  parse: (argv: any): ICommandInfo => {
    let commandInfo: ICommandInfo = {
      name: '',
      args: [],
      options: {},
    };

    const commands = argv._;
    commandInfo.name = (commands && commands.length > 0 ? commands[0] : '').trim();

    if (config.isDev()) {
      console.log({ name: commandInfo.name });
    }

    argv._.forEach((arg: string, idx: number) => {
      if (idx > 0) {
        commandInfo.args.push(arg);
      }
    });

    if (config.isDev()) {
      console.log({ args: commandInfo.args });
    }

    for (let o in argv) {
      if (argv.hasOwnProperty(o) && o !== '_' && o !== '$0') {
        commandInfo.options[o] = argv[o];
      }
    }

    if (config.isDev()) {
      console.log({ options: commandInfo.options });
    }

    return commandInfo;
  },
};

export default argsParser;
