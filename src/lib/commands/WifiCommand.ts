import BaseCommand from './BaseCommand.js';
import config from '../../config/config.js';
import DifferentNetworksError from '../errors/DifferentNetworksError.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import IpManager from '../core/IpManager.js';
import conprint from '../helpers/conprint.js';
import { no } from '../helpers/utils.js';
import spawnShellCmd from '../helpers/spawn-shell-cmd.js';
import ShellExitError from '../errors/ShellExitError.js';
import { EMPTY_DEVICE_IP_ADDRESS, EMPTY_HOST_IP_ADDRESS, NO_HOST_IP_IN_NETWORK } from '../errors/error-constants.js';
import store from '../helpers/store.js';
import getDevices from '../helpers/get-devices.js';
import Device from '../core/Device.js';
import askSelect from '../ask/ask-select.js';
import askInput from '../ask/ask-input.js';
import parseError from '../errors/parse-error.js';

import { ICommandInfo } from '../../types/types.js';

/**
 * Command to connect the device via Wi-Fi for debugging.
 */
class WifiCommand extends BaseCommand {
  private ipManager: IpManager;

  constructor(commandInfo: ICommandInfo) {
    super(commandInfo);
    this.ipManager = new IpManager();
  }

  /**
   * Gets the ip address to be disconnected.
   * @private
   */
  private async getIpForDisconnect() {
    const devices: Device[] = await getDevices();
    const tcpDevices: Device[] = [];

    for (let d of devices) {
      if (d.isTcpConnection()) {
        tcpDevices.push(d);
      }
    }

    if (tcpDevices.length > 0) {
      if (tcpDevices.length === 1) {
        // Only one device is currently connected via tcpip. Disconnect that one.
        return tcpDevices[0].sid;
      } else {
        // Multiple devices are currently connected via tcpip.
        // Ask user to select device to disconnect:
        const sidOptions: string[] = tcpDevices.map((d: Device) => d.sid);
        return await askSelect('tcpDevice', 'Select tcp-connected device', sidOptions);
      }
    }

    return this.ipManager.getDeviceIp();
  }

  async run() {
    await super.run();

    const isDisconnectAction = this.options.disconnect || this.args.includes('disconnect');
    if (isDisconnectAction) {
      console.log('Disconnecting...');

      try {
        const adbCmd: string = await buildAdbCommand(`disconnect ${await this.getIpForDisconnect()}`, this.options.sid);
        const output: string = await this.exec(adbCmd);
        conprint.info(output);
      } catch (e) {
        e = parseError(e);
        conprint.error(e.message);
      }

      return;
    }

    let deviceIp: string;
    try {
      deviceIp = await this.ipManager.getDeviceIp();
    } catch (e) {
      conprint.error(e.message);
      return;
    }

    if (no(deviceIp)) {
      conprint.error(EMPTY_DEVICE_IP_ADDRESS);
      return;
    }

    try {
      const hostIp: string = await this.ipManager.getHostIpInNetwork(deviceIp);

      if (no(hostIp)) {
        conprint.error(NO_HOST_IP_IN_NETWORK);
        return;
      }

      if (config.isDev()) {
        console.log('>> device ip: ', deviceIp);
        console.log('>> host ip:', hostIp);
      }

      if (this.ipManager.checkAreIPsInSameNetwork(deviceIp, hostIp)) {
        // => Same network
        try {
          /* const result = */
          await this.listenTcp();
          setTimeout(async () => {
            await askInput('done', 'Unplug usb and press ENTER/RETURN');
            await this.connectDeviceIp(deviceIp);
          }, 400);
        } catch (e) {
          conprint.error(parseError(e).message);
          return;
        }
      } else {
        // noinspection ExceptionCaughtLocallyJS
        throw new DifferentNetworksError();
      }
    } catch (e) {
      conprint.error(parseError(e).message);
    }
  }

  private async listenTcp(): Promise<{ code: number; output: string }> {
    let output = '';
    return new Promise(async (resolve, reject) => {
      const adbTcpIpCmd = await buildAdbCommand(`tcpip ${config.PORT_TCP}`, this.options.sid);

      spawnShellCmd(adbTcpIpCmd, {
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
          conprint.info(tcpipOutput);
        },
      });
    });
  }

  private async connectDeviceIp(deviceIp: string) {
    let _output = '';

    return new Promise(async (resolve, reject) => {
      const adbConnectCmd = await buildAdbCommand(`connect ${deviceIp}:${config.PORT_TCP}`, this.options.sid);
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
          conprint.info(output);
        },
      });
    });
  }
}

export default WifiCommand;
