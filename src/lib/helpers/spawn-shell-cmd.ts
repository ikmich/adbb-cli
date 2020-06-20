import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export interface ISpawnCallbacks {
    stdout: (data: string) => void;
    stderr: (data: string) => void;
    error: (error: Error) => void;
    close: (code: number, signal: NodeJS.Signals) => void;
}

const spawnShellCmd = (shellCmd: string, callbacks: ISpawnCallbacks, opts = {}) => {
    const parts = shellCmd.split(/\s+/);
    const main = parts[0];
    const args = parts.filter((entry, i) => {
        return i > 0;
    });

    const listener: ChildProcessWithoutNullStreams = spawn(main, args, opts);

    listener.stdout.on('data', data => {
        // consolePrint.info(chalk.green(`stdout: ${data}`));
        if (callbacks) {
            callbacks.stdout(data);
        }
    });

    listener.stderr.on('data', data => {
        // consolePrint.error(chalk.red(`stderr: ${data}`));
        if (callbacks) {
            callbacks.stderr(data);
        }
    });

    listener.on('error', error => {
        // consolePrint.error(chalk.red(`error: ${error.message}`));
        if (callbacks) {
            callbacks.error(error);
        }
    });

    listener.on('close', (code: number, signal: NodeJS.Signals) => {
        // consolePrint.notice(`child process exited with code ${code}`);
        if (callbacks) {
            callbacks.close(code, signal);
        }
    });

    // listener.on('exit', code => {
    //     console.log(`child process exited with code ${code}`);
    // });

    // listener.on('message', ((message, sendHandle) => {
    //     console.log(`>> message: ${message}`);
    //     console.log(`>> sendHandle: ${sendHandle}`);
    // }));

    // console.log('>> child process:');
    // console.log(listener);
};

export default spawnShellCmd;
