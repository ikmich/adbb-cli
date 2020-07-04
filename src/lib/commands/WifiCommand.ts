import BaseCommand from './BaseCommand';
import config from '../../config/config';
import DifferentNetworksError from '../errors/DifferentNetworksError';
import buildAdbCommand from '../helpers/build-adb-command';
import IpManager from '../core/IpManager';
import consolePrint from '../helpers/console-print';
import { no } from '../helpers/utils';
import spawnShellCmd from '../helpers/spawn-shell-cmd';
import ShellExitError from '../errors/ShellExitError';
import { EMPTY_DEVICE_IP_ADDRESS, EMPTY_HOST_IP_ADDRESS } from '../errors/error-constants';
import store from '../helpers/store';
import getDevices from '../helpers/get-devices';
import Device from '../core/Device';
import askSelect from '../ask/ask-select';
import askInput from '../ask/ask-input';
import parseError from '../errors/parse-error';

class WifiCommand extends BaseCommand {
    constructor(commandInfo) {
        super(commandInfo);
        this.printOutput = false;
    }

    async run() {
        const ipManager = new IpManager();

        async function getIpForDisconnect() {
            const devices: Device[] = await getDevices();
            const tcpDevices: Device[] = [];
            for (let d of devices) {
                if (d.isTcpConnection()) {
                    tcpDevices.push(d);
                }
            }

            if (tcpDevices.length > 0) {
                // Only one device is currently connected via tcpip. Disconnect that one.
                if (tcpDevices.length === 1) {
                    return tcpDevices[0].sid;
                } else {
                    // Multiple devices are currently connected via tcpip.
                    // Ask user to select device to disconnect:
                    const choices: string[] = tcpDevices.map((d: Device) => d.sid);
                    return await askSelect('tcpDevice', 'Select tcp-connected device', choices);
                }
            }

            return ipManager.getDeviceIp();
        }

        if (this.options.disconnect) {
            console.log('Disconnecting...');

            try {
                const adbCmd = await buildAdbCommand(`disconnect ${await getIpForDisconnect()}`);
                const output = await this.exec(adbCmd);
                consolePrint.info(output);
            } catch (e) {
                e = parseError(e);
                consolePrint.error(e.message);
            }

            return;
        }

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

        try {
            const hostIp = await ipManager.getHostIpInNetwork(deviceIp); // Todo - Get host ip in same network as device ip

            if (no(hostIp)) {
                consolePrint.error(EMPTY_HOST_IP_ADDRESS);
                return;
            }

            if (config.isDev()) {
                console.log('>> device ip: ', deviceIp);
                console.log('>> host ip:', hostIp);
            }

            /*const deviceIpParts = deviceIp.split('.');
            const hostIpParts = hostIp.split('.');

            if (
                deviceIpParts[0] === hostIpParts[0] &&
                deviceIpParts[1] === hostIpParts[1] &&
                deviceIpParts[2] === hostIpParts[2]
            )*/
            if (await ipManager.checkAreIPsInSameNetwork(deviceIp, hostIp)) {
                // => Same network
                try {
                    /*const result =*/
                    await this.listenTcp();
                    await setTimeout(async () => {
                        await askInput('done', 'Unplug usb and press ENTER/RETURN');
                        await this.connectDeviceIp(deviceIp);
                    }, 400);
                } catch (e) {
                    consolePrint.error(parseError(e).message);
                    return;
                }
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw new DifferentNetworksError();
            }
        } catch (e) {
            consolePrint.error(parseError(e).message);
        }
    }

    private async listenTcp(): Promise<{ code: number; output: string }> {
        let output = '';
        return new Promise(async (resolve, reject) => {
            const adbTcpipCmd = await buildAdbCommand(`tcpip ${config.PORT_TCP}`);

            spawnShellCmd(adbTcpipCmd, {
                close: async (code: number, signal: NodeJS.Signals) => {
                    if (code !== 0) {
                        // Wrong exit code
                        throw new ShellExitError(code);
                    }

                    resolve({ code, output });
                },
                error: function(e: Error) {
                    reject(e);
                },
                stderr: function(stream: Buffer, stderr: string) {
                    reject(new Error(stderr));
                },
                stdout: async function(stream: Buffer, tcpipOutput: string) {
                    output += tcpipOutput;
                    consolePrint.info(tcpipOutput);
                },
            });
        });
    }

    private async connectDeviceIp(deviceIp: string) {
        let _output = '';
        return new Promise(async (resolve, reject) => {
            const adbConnectCmd = await buildAdbCommand(`connect ${deviceIp}:${config.PORT_TCP}`);
            spawnShellCmd(adbConnectCmd, {
                close: function(code: number, signal: NodeJS.Signals) {
                    if (code !== 0) {
                        throw new ShellExitError(code);
                    }

                    resolve({ code, output: _output });
                },
                error: function(e: Error) {
                    reject(e);
                },
                stderr: function(stream: Buffer, stderr: string) {
                    reject(new Error(stderr));
                },
                stdout: function(stream: Buffer, output: string) {
                    // Connected.
                    _output += output;
                    store.saveWifiIp(deviceIp);
                    consolePrint.info(output);
                },
            });
        });
    }
}

export default WifiCommand;
