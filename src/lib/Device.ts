import { IDeviceInfo } from '../types/IDeviceInfo';

class Device implements IDeviceInfo {
    readonly device: string;
    readonly model: string;
    readonly product: string;
    readonly sid: string;
    readonly specSheet: string;
    readonly transportId: string;
    readonly usbId?: string | any;

    constructor(info: IDeviceInfo) {
        this.device = info.device;
        this.model = info.model;
        this.product = info.product;
        this.sid = info.sid;
        this.specSheet = info.specSheet;
        this.transportId = info.transportId;
        this.usbId = info.usbId;
    }
}

export default Device;