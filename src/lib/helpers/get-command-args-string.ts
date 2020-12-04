/**
 * Get the arguments passed to the cli command for the calling context.
 */
const getCommandArgsString = (): string => {
  let command = '';

  process.argv.forEach((entry, i) => {
    if (i > 1) {
      command += entry + ' ';
    }
  });

  return command.replace(/\s+$/, '');
};

export default getCommandArgsString;
