const getCliCommandString = (): string => {
  let command = '';

  process.argv.forEach((entry, i) => {
    if (i > 1) {
      command += entry + ' ';
    }
  });

  return command.replace(/\s+$/, '');
};

export default getCliCommandString;

