import UndefinedNetworkConfigError from './errors/UndefinedNetworkConfigError';
import NetConfig from './NetConfig';
import buildAdbCommand from './helpers/build-adb-command';
import config from '../config/config';
import errorParser from './errors/error-parser';
import execShellCmd from './helpers/exec-shell-cmd';
import { LOOPBACK_ADDRESS } from '../constants';
import chalk = require('chalk');
import { yes } from './helpers/utils';
import HostNotConnectedError from './errors/HostNotConnectedError';
import DeviceNotConnectedError from './errors/DeviceNotConnectedError';

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
            throw errorParser.parse(e);
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
            // console.log('>> ifconfig:', ifconfig);

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
            throw errorParser.parse(e);
        }

        if (yes(ip)) {
            return ip;
        }

        throw new HostNotConnectedError();
    }
}

export default IpManager;
