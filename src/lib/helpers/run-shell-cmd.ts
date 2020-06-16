import {exec, spawn, ExecException} from "child_process";
import chalk = require("chalk");

const runShellCmd = async (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                return reject(error);
            }

            if (stderr) {
                return reject(stderr);
            }

            return resolve(stdout);
        });
    });
};

export default runShellCmd;