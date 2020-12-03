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
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const get_devices_1 = __importDefault(require("../helpers/get-devices"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
class DevicesCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.options.verbose || this.options.json || this.options.grid) {
                    switch (true) {
                        case this.options.grid: {
                            const devices = yield get_devices_1.default();
                            console.table(devices);
                            break;
                        }
                        case this.options.json: {
                            const devices = yield get_devices_1.default();
                            conprint_1.default.success(JSON.stringify(devices, null, 2));
                            break;
                        }
                        default: {
                            let shellCmd = yield build_adb_command_1.default('devices -l');
                            shellCmd = this.applyFilter(shellCmd);
                            try {
                                const output = yield this.exec(shellCmd);
                                conprint_1.default.info(output);
                            }
                            catch (e) {
                                conprint_1.default.error(parse_error_1.default(e).message);
                                return;
                            }
                            break;
                        }
                    }
                }
                else {
                    let shellCmd = yield build_adb_command_1.default('devices');
                    shellCmd = this.applyFilter(shellCmd);
                    let output = '';
                    try {
                        output = yield this.exec(shellCmd);
                        conprint_1.default.info(output);
                    }
                    catch (e) {
                        conprint_1.default.error(parse_error_1.default(e).message);
                        return;
                    }
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e).message);
            }
        });
    }
}
exports.default = DevicesCommand;
