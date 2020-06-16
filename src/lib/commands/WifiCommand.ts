import BaseCommand from './BaseCommand';
import chalk = require('chalk');
import NetConfig from '../NetConfig';
import config from '../../config';
import {LOOPBACK_ADDRESS} from '../constants';
import DifferentNetworksError from '../errors/DifferentNetworksError';
import errorParser from '../errors/error-parser';
import buildAdbCommand from '../helpers/build-adb-command';
import UndefinedNetworkConfigError from "../errors/UndefinedNetworkConfigError";

class WifiCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
        this.printOutput = false;
    }

    async getHostIp() {
        let ip = '';
        try {
            let ifconfig = await this.exec('ifconfig | grep inet');
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
        }

        return ip;
    }

    async getDeviceNetworkConfigs(): Promise<NetConfig[]> {
        let shellCmd = await buildAdbCommand('shell ip -f inet addr | grep inet');
        let netConfigs: NetConfig[] = [];

        try {
            let cmdOutput = await this.exec(shellCmd);
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
        for (let nc of networkConfigs) {
            if ((/wlan/.test(nc.netInterface) || /rmnet/.test(nc.netInterface)) && nc.scope != 'lo') {
                return Promise.resolve(nc.ip);
            }
        }
        return Promise.reject('Could not get device ip');
    }

    async run() {
        if (this.options.disconnect) {
            console.log('Disconnecting...');
            try {
                const deviceIp = await this.getDeviceIp();
                const output = await this.exec(await buildAdbCommand(`disconnect ${deviceIp}`));
                console.log(chalk.blueBright(output));
            } catch (e) {
                console.log(chalk.red(`${e.message}`));
            }
            return;
        }

        try {
            const deviceIp = await this.getDeviceIp();
            const hostIp = await this.getHostIp();

            if (config.isDev()) {
                console.log('>> device ip: ', deviceIp);
                console.log('>> host ip:', hostIp);
            }

            const deviceIpParts = deviceIp.split('.');
            const hostIpParts = hostIp.split('.');

            if (
                deviceIpParts[0] === hostIpParts[0] &&
                deviceIpParts[1] === hostIpParts[1] &&
                deviceIpParts[2] === hostIpParts[2]
            ) {
                // => Same network
                const tcpipOutput = await this.exec(await buildAdbCommand('tcpip 5555'));
                setTimeout(async () => {
                    const connectOutput = await this.exec(await buildAdbCommand(`connect ${deviceIp}:5555`));
                    console.log(chalk.blueBright(connectOutput));
                }, 200);
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw new DifferentNetworksError();
            }
        } catch (e) {
            console.log(chalk.red(e.message));
        }
    }
}

export default WifiCommand;
