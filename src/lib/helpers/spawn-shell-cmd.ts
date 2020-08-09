import {ChildProcessWithoutNullStreams, SendHandle, Serializable, spawn} from 'child_process';
import {ISpawnCallbacks} from '../../types/ISpawnCallbacks';

const os = require('os');

const osType = os.platform();

let defaultOpts: any = {
  encoding: 'utf-8',
};

if (osType == 'win32') {
  defaultOpts.shell = true;
}

const spawnShellCmd = (
    shellCmd: string,
    callbacks: ISpawnCallbacks,
    opts: any = defaultOpts,
): ChildProcessWithoutNullStreams => {
  const parts = shellCmd.split(/\s+/);
  const main = parts[0];
  const args = parts.filter((entry, i) => {
    return i > 0;
  });

  const childProcess: ChildProcessWithoutNullStreams = spawn(main, args, opts);

  childProcess.stdout.on('data', (data: Buffer) => {
    if (callbacks && callbacks.stdout) {
      callbacks.stdout(data, data.toString()); //removeEndLines(data.toString(), 1)
    }
  });

  childProcess.stderr.on('data', (data: Buffer) => {
    if (callbacks && callbacks.stderr) {
      callbacks.stderr(data, data.toString());
    }
  });

  childProcess.on('error', error => {
    if (callbacks && callbacks.error) {
      callbacks.error(error);
    }
  });

  childProcess.on('close', (code: number, signal: NodeJS.Signals) => {
    if (callbacks && callbacks.close) {
      callbacks.close(code, signal);
    }
  });

  childProcess.on('exit', (code: number, signal: NodeJS.Signals) => {
    if (callbacks && callbacks.exit) {
      callbacks.exit(code, signal);
    }
  });

  childProcess.on('message', (message: Serializable, sendHandle: SendHandle) => {
    if (callbacks && callbacks.message) {
      callbacks.message(message, sendHandle);
    }
  });

  return childProcess;
};

export default spawnShellCmd;
