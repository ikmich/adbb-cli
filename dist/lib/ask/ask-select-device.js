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
const get_devices_1 = __importDefault(require("../helpers/get-devices"));
const inquirer_1 = __importDefault(require("inquirer"));
const askSelectDevice = () => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield get_devices_1.default();
    if (devices && devices.length > 1) {
        const deviceIds = devices.map(deviceInfo => {
            return deviceInfo.sid;
        });
        const answer = yield inquirer_1.default.prompt({
            type: 'list',
            name: 'device',
            message: 'Select preferred device:',
            choices: deviceIds,
        });
        return answer.device;
    }
});
exports.default = askSelectDevice;
