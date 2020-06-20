import { exec, spawn, ExecException } from 'child_process';
import config from '../../config/config';
import {removeEndLineSpace} from "./utils";

const execShellCmd = async (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
                return;
            }

            if (stderr) {
                reject(stderr);
                return;
            }

            setTimeout(() => {
                resolve(removeEndLineSpace(stdout));
            }, config.cmd_exec_delay);
        });
    });
};

export default execShellCmd;
