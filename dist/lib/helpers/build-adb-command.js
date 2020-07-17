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
const chalk = require("chalk");
const buildAdbCommand = (optsString, sid = '') => __awaiter(void 0, void 0, void 0, function* () {
    let commandString = 'adb';
    let flag_devices = /devices/gi.test(optsString);
    let flag_disconnect = /disconnect/gi.test(optsString);
    if (sid && sid.trim() !== '') {
        commandString += ` -s ${sid}`;
    }
    else if (!flag_devices && !flag_disconnect) {
        // If multiple devices, show options to select device id
        const devices = yield get_devices_1.default();
        if (devices && devices.length > 1) {
            console.log(chalk.yellow('Multiple devices/emulators connected.'));
            const device = yield ask_select_device_1.default();
            if (device) {
                commandString += ` -s ${device}`;
            }
        }
    }
    commandString += ` ${optsString}`;
    // console.log('>> command:', commandString);
    return commandString;
});
exports.default = buildAdbCommand;
