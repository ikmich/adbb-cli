"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const os = require('os');
const osType = os.platform();
let defaultOpts = {
    encoding: 'utf-8',
};
if (osType == 'win32') {
    defaultOpts.shell = true;
}
const spawnShellCmd = (shellCmd, callbacks, opts = defaultOpts) => {
    const parts = shellCmd.split(/\s+/);
    const main = parts[0];
    const args = parts.filter((entry, i) => {
        return i > 0;
    });
    const childProcess = child_process_1.spawn(main, args, opts);
    childProcess.stdout.on('data', (data) => {
        if (callbacks && callbacks.stdout) {
            callbacks.stdout(data, data.toString()); //removeEndLines(data.toString(), 1)
        }
    });
    childProcess.stderr.on('data', (data) => {
        if (callbacks && callbacks.stderr) {
            callbacks.stderr(data, data.toString());
        }
    });
    childProcess.on('error', error => {
        if (callbacks && callbacks.error) {
            callbacks.error(error);
        }
    });
    childProcess.on('close', (code, signal) => {
        if (callbacks && callbacks.close) {
            callbacks.close(code, signal);
        }
    });
    childProcess.on('exit', (code, signal) => {
        if (callbacks && callbacks.exit) {
            callbacks.exit(code, signal);
        }
    });
    childProcess.on('message', (message, sendHandle) => {
        if (callbacks && callbacks.message) {
            callbacks.message(message, sendHandle);
        }
    });
    return childProcess;
};
exports.default = spawnShellCmd;
