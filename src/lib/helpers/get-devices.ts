import execShellCmd from './exec-shell-cmd.js';
import Device from '../core/Device.js';
import { IDeviceInfo } from '../../types/types.js';

const getDevices = async (): Promise<Device[]> => {
  let results: Device[] = [];
  const output = await execShellCmd('adb devices -l');

  const regexConnectedGlobal =
    /[a-z0-9.:]+\s+\w+(\s+usb:\w+)?\s+product:\w+\s+model:\w+\s+device:\w+\s+transport_id:\w+/gim;
  const connectedGlobalMatches: any = output.match(regexConnectedGlobal);
  if (connectedGlobalMatches && connectedGlobalMatches.length > 0) {
    // console.log('\nglobalMatches:', globalMatches);
    connectedGlobalMatches.forEach((resultLine: string, index: number) => {
      // console.log(`\ndevice result line ${index}`);
      const rexTokens =
        /([a-z0-9.:]+)\s+(\w+)\s+(usb:(\w+))?\s*product:(\w+)\s+model:(\w+)\s+device:(\w+)\s+transport_id:(\w+)/i;
      const tokensMatches: any = resultLine.match(rexTokens);
      if (tokensMatches && tokensMatches.length > 0) {
        let matchIds = {
          specSheet: 0,
          sid: 1,
          state: 2,
          usbId: 4,
          product: 5,
          model: 6,
          device: 7,
          transportId: 8,
        };

        // console.log('tokensMatches:', tokensMatches);
        const deviceInfo: IDeviceInfo = {
          specSheet: tokensMatches[matchIds.specSheet],
          sid: tokensMatches[matchIds.sid],
          state: tokensMatches[matchIds.state],
          usbId: tokensMatches[matchIds.usbId] || null,
          product: tokensMatches[matchIds.product],
          model: tokensMatches[matchIds.model],
          device: tokensMatches[matchIds.device],
          transportId: tokensMatches[matchIds.transportId],
        };
        results.push(new Device(deviceInfo));
      }
    });
  }

  // Parse output for 'not online' devices
  const regexNotOnlineGlobal = /[a-z0-9.:]+\s+\w+\s+transport_id:\w+/gim;
  const connectedNotOnlineMatches: any = output.match(regexNotOnlineGlobal);

  if (connectedNotOnlineMatches && connectedNotOnlineMatches.length > 0) {
    connectedNotOnlineMatches.forEach((resultLine: string, index: number) => {
      const tokensRegex = /([a-z0-9.:]+)\s+(\w+)\s+transport_id:(\w+)/i;
      const tokensMatches: any = resultLine.match(tokensRegex);
      if (tokensMatches && tokensMatches.length > 0) {
        let matchIds = {
          specSheet: 0,
          sid: 1,
          state: 2,
          // usbId: 4,
          // product: 5,
          // model: 6,
          // device: 7,
          transportId: 3,
        };
        const deviceInfo: IDeviceInfo = {
          specSheet: tokensMatches[matchIds.specSheet],
          sid: tokensMatches[matchIds.sid],
          state: tokensMatches[matchIds.state],
          product: '',
          model: '',
          device: '',
          transportId: tokensMatches[matchIds.transportId],
        };

        results.push(new Device(deviceInfo));
      }
    });
  }

  return results;
};

export default getDevices;
