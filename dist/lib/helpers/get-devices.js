"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_shell_cmd_1 = __importDefault(require("./exec-shell-cmd"));
const Device_1 = __importDefault(require("../core/Device"));
const getDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    let results = [];
    const output = yield exec_shell_cmd_1.default('adb devices -l');
    const regexConnectedGlobal = /[a-z0-9.:]+\s+\w+(\s+usb:\w+)?\s+product:\w+\s+model:\w+\s+device:\w+\s+transport_id:\w+/gim;
    const connectedGlobalMatches = output.match(regexConnectedGlobal);
    if (connectedGlobalMatches && connectedGlobalMatches.length > 0) {
        // console.log('\nglobalMatches:', globalMatches);
        connectedGlobalMatches.forEach((resultLine, index) => {
            // console.log(`\ndevice result line ${index}`);
            const rexTokens = /([a-z0-9.:]+)\s+(\w+)\s+(usb:(\w+))?\s*product:(\w+)\s+model:(\w+)\s+device:(\w+)\s+transport_id:(\w+)/i;
            const tokensMatches = resultLine.match(rexTokens);
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
                const deviceInfo = {
                    specSheet: tokensMatches[matchIds.specSheet],
                    sid: tokensMatches[matchIds.sid],
                    state: tokensMatches[matchIds.state],
                    usbId: tokensMatches[matchIds.usbId] || null,
                    product: tokensMatches[matchIds.product],
                    model: tokensMatches[matchIds.model],
                    device: tokensMatches[matchIds.device],
                    transportId: tokensMatches[matchIds.transportId],
                };
                results.push(new Device_1.default(deviceInfo));
            }
        });
    }
    // Parse output for 'not online' devices
    const regexNotOnlineGlobal = /[a-z0-9.:]+\s+\w+\s+transport_id:\w+/gim;
    const connectedNotOnlineMatches = output.match(regexNotOnlineGlobal);
    if (connectedNotOnlineMatches && connectedNotOnlineMatches.length > 0) {
        connectedNotOnlineMatches.forEach((resultLine, index) => {
            const tokensRegex = /([a-z0-9.:]+)\s+(\w+)\s+transport_id:(\w+)/i;
            const tokensMatches = resultLine.match(tokensRegex);
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
                const deviceInfo = {
                    specSheet: tokensMatches[matchIds.specSheet],
                    sid: tokensMatches[matchIds.sid],
                    state: tokensMatches[matchIds.state],
                    product: '',
                    model: '',
                    device: '',
                    transportId: tokensMatches[matchIds.transportId],
                };
                results.push(new Device_1.default(deviceInfo));
            }
        });
    }
    return results;
});
exports.default = getDevices;
