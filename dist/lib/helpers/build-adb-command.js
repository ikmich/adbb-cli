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
const get_devices_1 = __importDefault(require("./get-devices"));
const ask_select_device_1 = __importDefault(require("../ask/ask-select-device"));
const conprint_1 = __importDefault(require("./conprint"));
const utils_1 = require("./utils");
const store_1 = __importDefault(require("./store"));
const config_1 = __importDefault(require("../../config/config"));
/**
 *
 * @param argsString The string of options passed to the adb command
 * @param sid The device sid
 */
const buildAdbCommand = (argsString, sid) => __awaiter(void 0, void 0, void 0, function* () {
    let cachedSid = store_1.default.getTargetSid();
    if (config_1.default.isDev()) {
        console.log({ cachedSid });
    }
    if (utils_1.yes(cachedSid)) {
        sid = cachedSid;
    }
    let commandString = 'adb';
    let isDevicesCmd = /devices/gi.test(argsString);
    let isDisconnectCmd = /disconnect/gi.test(argsString);
    if (!utils_1.isEmpty(sid)) {
        commandString += ` -s ${sid}`;
    }
    else if (!isDevicesCmd && !isDisconnectCmd) {
        // If multiple devices, show options to select device id
        const devices = yield get_devices_1.default();
        if (devices && devices.length > 1) {
            conprint_1.default.notice('Multiple devices/emulators connected.');
            const device = yield ask_select_device_1.default();
            if (device) {
                commandString += ` -s ${device}`;
            }
        }
    }
    commandString += ` ${argsString}`;
    // console.log('>> command:', commandString);
    return commandString;
});
exports.default = buildAdbCommand;
