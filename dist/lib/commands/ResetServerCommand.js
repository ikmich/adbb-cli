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
const BaseCommand_1 = __importDefault(require("./BaseCommand"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const utils_1 = require("../helpers/utils");
const get_devices_1 = __importDefault(require("../helpers/get-devices"));
class ResetServerCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this);
            try {
                const devices = yield get_devices_1.default();
                if (Array.isArray(devices) && devices.length > 0) {
                    let d = devices[0];
                    // Only run 'adb usb' if usb device is connected
                    if (utils_1.yes(d.usbId)) {
                        const output_disconnect = yield exec_shell_cmd_1.default('adb disconnect');
                        conprint_1.default.info(output_disconnect);
                        const output_usb = yield exec_shell_cmd_1.default('adb usb');
                        conprint_1.default.info(output_usb);
                    }
                }
                const output_kill_server = yield exec_shell_cmd_1.default('adb kill-server');
                conprint_1.default.info(output_kill_server);
                yield utils_1.wait(200);
                const output_start_server = yield exec_shell_cmd_1.default('adb start-server');
                conprint_1.default.info(output_start_server);
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e).message);
                return;
            }
            // setTimeout(async () => {
            //   try {
            //     const output2 = await execShellCmd('adb start-server');
            //     conprint.info(output2);
            //   } catch (e) {
            //     conprint.error(parseError(e).message);
            //   }
            // }, 200);
        });
    }
}
exports.default = ResetServerCommand;
