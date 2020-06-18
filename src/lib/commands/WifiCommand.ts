import BaseCommand from './BaseCommand';
import NetConfig from '../NetConfig';
import config from '../../config';
import { LOOPBACK_ADDRESS } from '../../constants';
import DifferentNetworksError from '../errors/DifferentNetworksError';
import errorParser from '../errors/error-parser';
import buildAdbCommand from '../helpers/build-adb-command';
import UndefinedNetworkConfigError from '../errors/UndefinedNetworkConfigError';
import chalk = require('chalk');
import IpManager from '../IpManager';
import consolePrint from '../helpers/console-print';
import { no } from '../helpers/utils';
import spawnShellCmd from '../helpers/spawn-shell-cmd';

class WifiCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
        this.printOutput = false;
    }

    async run() {
        const ipManager = new IpManager();
        let deviceIp;
        try {
            deviceIp = await ipManager.getDeviceIp();
        } catch (e) {
            consolePrint.error(e.message);
            return;
        }

        if (no(deviceIp)) {
            consolePrint.error('Empty device ip');
            return;
        }

        if (this.options.disconnect) {
            console.log('Disconnecting...');
            try {
                // const deviceIp = await ipManager.getDeviceIp();
                const output = await this.exec(await buildAdbCommand(`disconnect ${deviceIp}`));
                console.log(chalk.blueBright(output));
            } catch (e) {
                e = errorParser.parse(e);
                console.log(chalk.red(`${e.message}`));
            }
            return;
        }

        try {
            //const deviceIp = await this.getDeviceIp();
            const hostIp = await ipManager.getHostIp();

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
                const adbTcpipCmd = await buildAdbCommand('tcpip 5555');
                /*const tcpipOutput = await this.exec(adbTcpipCmd);
                setTimeout(async () => {
                    const connectOutput = await this.exec(await buildAdbCommand(`connect ${deviceIp}:5555`));
                    console.log(chalk.blueBright(connectOutput));
                }, 200);*/

                spawnShellCmd(adbTcpipCmd, {
                    close: function(code: number, signal: NodeJS.Signals) {},
                    error: function(e: Error) {
                        throw e;
                    },
                    stderr: function(stderr: string) {
                        throw new Error(stderr);
                    },
                    stdout: async function(tcpipOutput: string) {
                        consolePrint.info(tcpipOutput);
                        //
                        const adbConnectCmd = await buildAdbCommand(`connect ${deviceIp}:5555`);
                        spawnShellCmd(adbConnectCmd, {
                            close: function(code: number, signal: NodeJS.Signals) {},
                            error: function(e: Error) {
                                throw e;
                            },
                            stderr: function(stderr: string) {
                                throw new Error(stderr);
                            },
                            stdout: function(output: string) {
                                consolePrint.info(output);
                            },
                        });
                    },
                });
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
