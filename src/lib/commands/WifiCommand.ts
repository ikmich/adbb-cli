import BaseCommand from './BaseCommand';
import config from '../../config/config';
import DifferentNetworksError from '../errors/DifferentNetworksError';
import errorParser from '../errors/error-parser';
import buildAdbCommand from '../helpers/build-adb-command';
import IpManager from '../IpManager';
import consolePrint from '../helpers/console-print';
import {no} from '../helpers/utils';
import spawnShellCmd from '../helpers/spawn-shell-cmd';
import ShellExitError from '../errors/ShellExitError';
import {EMPTY_DEVICE_IP_ADDRESS, EMPTY_HOST_IP_ADDRESS} from "../errors/error-constants";

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
            consolePrint.error(EMPTY_DEVICE_IP_ADDRESS);
            return;
        }

        if (this.options.disconnect) {
            console.log('Disconnecting...');
            try {
                const adbCmd = await buildAdbCommand(`disconnect ${deviceIp}`);
                const output = await this.exec(adbCmd);
                consolePrint.info(output);
            } catch (e) {
                e = errorParser.parse(e);
                consolePrint.error(e.message);
            }
            return;
        }

        try {
            const hostIp = await ipManager.getHostIp();

            if (no(hostIp)) {
                consolePrint.error(EMPTY_HOST_IP_ADDRESS);
                return;
            }

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

                spawnShellCmd(adbTcpipCmd, {
                    close: function(code: number, signal: NodeJS.Signals) {
                        if (code !== 0) {
                            // Wrong exit code
                            throw new ShellExitError(code);
                        }
                    },
                    error: function(e: Error) {
                        throw e;
                    },
                    stderr: function(stderr: string) {
                        throw new Error(stderr);
                    },
                    stdout: async function(tcpipOutput: string) {
                        consolePrint.info(tcpipOutput);

                        const adbConnectCmd = await buildAdbCommand(`connect ${deviceIp}:5555`);
                        spawnShellCmd(adbConnectCmd, {
                            close: function(code: number, signal: NodeJS.Signals) {
                                if (code !== 0) {
                                    throw new ShellExitError(code);
                                }
                            },
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
            consolePrint.error(errorParser.parse(e).message);
        }
    }
}

export default WifiCommand;
