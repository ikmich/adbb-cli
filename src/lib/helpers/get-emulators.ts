import execShellCmd from './exec-shell-cmd';

const getEmulators = async (): Promise<string[]> => {
  let results: string[] = [];
  const output = await execShellCmd('emulator -list-avds');

  const rexGlobal = /\w+/gim;
  const emulators: any = output.match(rexGlobal);
  if (emulators && emulators.length > 0) {
    results = emulators;
  }

  return results;
};

export default getEmulators;
