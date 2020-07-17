"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
class Device {
    constructor(info) {
        this.device = info.device;
        this.model = info.model;
        this.product = info.product;
        this.sid = info.sid;
        this.specSheet = info.specSheet;
        this.transportId = info.transportId;
        this.usbId = info.usbId;
        this.state = info.state;
    }
    isTcpConnection() {
        return config_1.default.ipRegex.test(this.sid);
    }
    isOnline() {
        return this.state.toLowerCase() == 'device';
    }
}
exports.default = Device;
