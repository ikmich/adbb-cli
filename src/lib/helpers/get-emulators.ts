import runShellCmd from './run-shell-cmd';

const getEmulators = async (): Promise<string[]> => {
    let results: string[] = [];
    const output = await runShellCmd('emulator -list-avds');

    const rexGlobal = /\w+/gmi;
    const emulators: any = output.match(rexGlobal);
    if (emulators && emulators.length > 0) {
        results = emulators;
    }

    return results;
};

export default getEmulators;
