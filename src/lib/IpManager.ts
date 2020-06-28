import UndefinedNetworkConfigError from './errors/UndefinedNetworkConfigError';
import NetConfig from './NetConfig';
import buildAdbCommand from './helpers/build-adb-command';
import config from '../config/config';
import execShellCmd from './helpers/exec-shell-cmd';
import { LOOPBACK_ADDRESS } from '../constants';
import { removeEndLines, yes } from './helpers/utils';
import HostNotConnectedError from './errors/HostNotConnectedError';
import DeviceNotConnectedError from './errors/DeviceNotConnectedError';
import parseError from './errors/parse-error';
import spawnShellCmd from './helpers/spawn-shell-cmd';
import consolePrint from './helpers/console-print';
import { ChildProcessWithoutNullStreams } from 'child_process';
import chalk = require('chalk');

class IpManager {
    async getDeviceNetworkConfigs(): Promise<NetConfig[]> {
        let commandString = 'shell ip -f inet addr | grep inet';

        let shellCmd = await buildAdbCommand(commandString);
        let netConfigs: NetConfig[] = [];

        try {
            let cmdOutput = await execShellCmd(shellCmd);

            let rexConfigString = /(inet \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,3}\s+.*scope\s+\w+\s+\w+$)/gim;
            let allConfigsMatches: any = cmdOutput.match(rexConfigString);

            if (allConfigsMatches && allConfigsMatches.length > 0) {
                allConfigsMatches.forEach((configString: string, idx: number) => {
                    if (config.isDev()) {
                        // console.log(`>> config: ${idx}`, configString);
                    }

                    let rex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,3})\s+.*scope\s+(\w+)\s+(\w+$)/i;
                    let singleConfigMatches: any = configString.match(rex);
                    if (singleConfigMatches && singleConfigMatches.length > 0) {
                        let ip = singleConfigMatches[1].replace(/\/\d{1,3}$/, '');
                        let scope = singleConfigMatches[2];
                        let netInterface = singleConfigMatches[3];

                        netConfigs.push(new NetConfig(ip, scope, netInterface));
                        if (config.isDev()) {
                            // console.log(`>> matches ${idx}:`, singleConfigMatches);
                            // console.log('\n');
                        }
                    }
                });
            }
        } catch (e) {
            throw parseError(e);
        }

        return netConfigs;
    }

    async getDeviceIp(): Promise<string> {
        let networkConfigs = await this.getDeviceNetworkConfigs();
        if (!networkConfigs) {
            throw new UndefinedNetworkConfigError();
        }

        let choiceConfig: NetConfig | any = null;
        let hasWlanInterface = false;
        let hasRmnetInterface = false;

        // Priority 1 : 'wlan'
        for (let nc of networkConfigs) {
            if (/wlan/.test(nc.netInterface) && nc.scope != 'lo') {
                hasWlanInterface = true;
                choiceConfig = nc;
                break;
            }
        }

        // Priority 2: 'rmnet'
        if (!choiceConfig) {
            for (let nc of networkConfigs) {
                if (/rmnet/.test(nc.netInterface) && nc.scope != 'lo') {
                    hasRmnetInterface = true;
                    choiceConfig = nc;
                    break;
                }
            }
        }

        if (choiceConfig) {
            return Promise.resolve(choiceConfig.ip);
        }

        // No network config.
        throw new DeviceNotConnectedError();
    }

    async getHostIp() {
        let ip = '';
        try {
            let ifconfig = await execShellCmd('ifconfig | grep inet');
            let rexConfigs = /inet (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gim;
            let configLineMatches: any = ifconfig.match(rexConfigs);

            for (let configLine of configLineMatches) {
                if (configLine.indexOf(LOOPBACK_ADDRESS) > -1) {
                    continue;
                }

                let rexIp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i;
                let ipResults: any = configLine.match(rexIp);
                if (ipResults && ipResults.length > 0) {
                    //console.log('-->>>> ipResults', ipResults);
                    ip = ipResults[1];
                }
            }
        } catch (e) {
            console.log(chalk.red(`Could not get host ip: ${e.message}`));
            throw parseError(e);
        }

        if (yes(ip)) {
            return ip;
        }

        throw new HostNotConnectedError();
    }

    /**
     * Pings an ip address
     * @param ip
     */
    async ping(ip: string): Promise<TPingResult> {
        return new Promise((resolve, reject) => {
            let output = '';
            try {
                let childProcess: ChildProcessWithoutNullStreams = spawnShellCmd(`ping -c ${config.PING_COUNT} ${ip}`, {
                    close: function(code: number, p2: NodeJS.Signals) {
                        if (code === 0) {
                            let lines: string[] = output.split(/\n|\r\n/);
                            // First line is a summary info line, and not relevant in ping results for calculating timeout
                            lines.splice(0, 1);
                            let timeoutPct: number;
                            let timeouts = 0;

                            // Calculate timeout rate
                            lines.forEach(line => {
                                if (/timeout/.test(line)) {
                                    ++timeouts;
                                }
                            });
                            timeoutPct = Math.round((timeouts / lines.length) * 100);

                            const resultPayload = { output, childProcess, timeoutPct };
                            resolve(resultPayload);
                        } else {
                            // Wrong exit code
                            consolePrint.notice(`Exited with code ${code}`);
                            reject({
                                code,
                                message: `Exited with code ${code}`,
                            });
                        }
                    },
                    error: function(e: Error) {
                        reject(e);
                    },
                    // message: function(ser: Serializable, sh: SendHandle) {},
                    stderr: function(stream: Buffer, stderr: string) {
                        reject(new Error(stderr));
                    },
                    stdout: function(stream: Buffer, stdout: string) {
                        output += stdout;
                        // Print ping result line
                        consolePrint.info(removeEndLines(stdout, 1));
                    },
                });
            } catch (e) {
                consolePrint.error(e.message);
            }
        });
    }
}

export type TPingResult = {
    output: string;
    childProcess: ChildProcessWithoutNullStreams;
    timeoutPct: number;
};

export default IpManager;
