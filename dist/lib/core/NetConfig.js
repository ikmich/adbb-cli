"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetConfig {
    constructor(ip, scope, netInterface) {
        this.ip = '';
        this.scope = '';
        this.netInterface = '';
        this.ip = ip;
        this.scope = scope;
        this.netInterface = netInterface;
    }
}
exports.default = NetConfig;
