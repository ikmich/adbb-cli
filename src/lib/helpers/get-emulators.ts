import execShellCmd from './exec-shell-cmd.js';

const getEmulators = async (): Promise<string[]> => {
  // let results: string[] = [];
  const output = await execShellCmd('emulator -list-avds');

  return output.split(/\n+/);
};

export default getEmulators;
