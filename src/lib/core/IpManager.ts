import UndefinedNetworkConfigError from '../errors/UndefinedNetworkConfigError.js';
import NetConfig from './NetConfig.js';
import buildAdbCommand from '../helpers/build-adb-command.js';
import config from '../../config/config.js';
import execShellCmd from '../helpers/exec-shell-cmd.js';
import { removeEndLines } from '../helpers/utils.js';
import DeviceNotConnectedError from '../errors/DeviceNotConnectedError.js';
import parseError from '../errors/parse-error.js';
import spawnShellCmd from '../helpers/spawn-shell-cmd.js';
import conprint from '../helpers/conprint.js';
import { ChildProcessWithoutNullStreams } from 'child_process';
// const ip = require('ip');
import ip from 'ip';

class IpManager {
  async getDeviceNetworkConfigs(deviceSid?: string): Promise<NetConfig[]> {
    let commandString = `shell ip -f inet addr | ${config.cmd.grep} inet`;

    let shellCommand = await buildAdbCommand(commandString, deviceSid);
    let netConfigs: NetConfig[] = [];

    try {
      let cmdOutput = await execShellCmd(shellCommand);

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

  async getDeviceIp(deviceSid?: string): Promise<string> {
    let networkConfigs = await this.getDeviceNetworkConfigs(deviceSid);
    if (!networkConfigs) {
      throw new UndefinedNetworkConfigError();
    }

    let choiceConfig: NetConfig | any = null;
    let hasWlanInterface = false;
    let hasRmnetInterface = false;

    // Priority 1 : 'wlan'
    for (let nc of networkConfigs) {
      if (/wlan/i.test(nc.netInterface) && nc.scope != 'lo') {
        hasWlanInterface = true;
        choiceConfig = nc;
        break;
      }
    }

    // Priority 2: 'rmnet'
    if (!choiceConfig) {
      for (let nc of networkConfigs) {
        if (/rmnet/i.test(nc.netInterface) && nc.scope != 'lo') {
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

  async getHostIpInNetwork(referenceIp: string) {
    let hostIp = ip.address('public', 'ipv4');
    if (this.checkAreIPsInSameNetwork(hostIp, referenceIp)) {
      return hostIp;
    }

    // No host ip is in same network as device.
    return '';
  }

  checkAreIPsInSameNetwork(ip1: string, ip2: string): boolean {
    const ip1Parts = ip1.split('.');
    const ip2Parts = ip2.split('.');

    return ip1Parts[0] === ip2Parts[0] && ip1Parts[1] === ip2Parts[1] && ip1Parts[2] === ip2Parts[2];
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
          close: function (code: number, p2: NodeJS.Signals) {
            if (code === 0) {
              let lines: string[] = output.split(/\n|\r\n/);
              // First line is a summary info line, and not relevant in ping results for calculating timeout rate
              lines.splice(0, 1);
              let timeoutPct: number;
              let timeouts = 0;

              // Calculate timeout rate
              lines.forEach((line) => {
                if (/timeout/.test(line)) {
                  ++timeouts;
                }
              });
              timeoutPct = Math.round((timeouts / lines.length) * 100);

              const resultPayload = { output, childProcess, timeoutPct };
              resolve(resultPayload);
            } else {
              // Wrong exit code
              conprint.notice(`Exited with code ${code}`);
              reject({
                code,
                message: `Exited with code ${code}`,
              });
            }
          },
          error: function (e: Error) {
            reject(e);
          },
          // message: function(ser: Serializable, sh: SendHandle) {},
          stderr: function (stream: Buffer, stderr: string) {
            reject(new Error(stderr));
          },
          stdout: function (stream: Buffer, stdout: string) {
            output += stdout;
            // Print ping result line
            conprint.info(removeEndLines(stdout, 1));
          },
        });
      } catch (e) {
        conprint.error(e.message);
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
