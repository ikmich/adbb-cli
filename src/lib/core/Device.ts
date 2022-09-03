import { IDeviceInfo } from '../../types/IDeviceInfo.js';
import config from '../../config/config.js';

class Device implements IDeviceInfo {
  readonly device: string;
  readonly model: string;
  readonly product: string;
  readonly sid: string;
  readonly specSheet: string;
  readonly transportId: string;
  readonly usbId?: string | any;
  readonly state: string;

  constructor(info: IDeviceInfo) {
    this.device = info.device;
    this.model = info.model;
    this.product = info.product;
    this.sid = info.sid;
    this.specSheet = info.specSheet;
    this.transportId = info.transportId;
    this.usbId = info.usbId;
    this.state = info.state;
  }

  isTcpConnection(): boolean {
    return config.ipRegex.test(this.sid);
  }

  isOnline(): boolean {
    return this.state.toLowerCase() == 'device';
  }
}

export default Device;
