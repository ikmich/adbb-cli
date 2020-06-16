import runShellCmd from './run-shell-cmd';
import { DeviceInfo } from '../../types/DeviceInfo.type';

const getDevices = async (): Promise<DeviceInfo[]> => {
    let results: DeviceInfo[] = [];
    const output = await runShellCmd('adb devices -l');

    const rexGlobal = /[a-z0-9.:]+\s+device(\s+usb:\w+)?\s+product:\w+\s+model:\w+\s+device:\w+\s+transport_id:\w+/gim;
    const globalMatches: any = output.match(rexGlobal);
    if (globalMatches && globalMatches.length > 0) {
        // console.log('\nglobalMatches:', globalMatches);

        globalMatches.forEach((resultLine: string, index: number) => {
            // console.log(`\ndevice result line ${index}`);
            const rexTokens = /([a-z0-9.:]+)\s+device\s+(usb:(\w+))?\s*product:(\w+)\s+model:(\w+)\s+device:(\w+)\s+transport_id:(\w+)/i;
            const tokensMatches: any = resultLine.match(rexTokens);
            if (tokensMatches && tokensMatches.length > 0) {
                // console.log('tokensMatches:', tokensMatches);
                const deviceInfo: DeviceInfo = {
                    specSheet: tokensMatches[0],
                    sid: tokensMatches[1],
                    usbId: tokensMatches[3] || null,
                    product: tokensMatches[4],
                    model: tokensMatches[5],
                    device: tokensMatches[6],
                    transportId: tokensMatches[7],
                };
                results.push(deviceInfo);
            }
        });
    }
    return results;
};

export default getDevices;
