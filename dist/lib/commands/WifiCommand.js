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
const config_1 = __importDefault(require("../../config/config"));
const DifferentNetworksError_1 = __importDefault(require("../errors/DifferentNetworksError"));
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const IpManager_1 = __importDefault(require("../core/IpManager"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const utils_1 = require("../helpers/utils");
const spawn_shell_cmd_1 = __importDefault(require("../helpers/spawn-shell-cmd"));
const ShellExitError_1 = __importDefault(require("../errors/ShellExitError"));
const error_constants_1 = require("../errors/error-constants");
const store_1 = __importDefault(require("../helpers/store"));
const get_devices_1 = __importDefault(require("../helpers/get-devices"));
const ask_select_1 = __importDefault(require("../ask/ask-select"));
const ask_input_1 = __importDefault(require("../ask/ask-input"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
class WifiCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this);
            const ipManager = new IpManager_1.default();
            const getIpForDisconnect = () => __awaiter(this, void 0, void 0, function* () {
                const devices = yield get_devices_1.default();
                const tcpDevices = [];
                for (let d of devices) {
                    if (d.isTcpConnection()) {
                        tcpDevices.push(d);
                    }
                }
                if (tcpDevices.length > 0) {
                    if (tcpDevices.length === 1) {
                        // Only one device is currently connected via tcpip. Disconnect that one.
                        return tcpDevices[0].sid;
                    }
                    else {
                        // Multiple devices are currently connected via tcpip.
                        // Ask user to select device to disconnect:
                        const choices = tcpDevices.map((d) => d.sid);
                        return yield ask_select_1.default('tcpDevice', 'Select tcp-connected device', choices);
                    }
                }
                return ipManager.getDeviceIp();
            });
            if (this.options.disconnect) {
                console.log('Disconnecting...');
                try {
                    const adbCmd = yield build_adb_command_1.default(`disconnect ${yield getIpForDisconnect()}`, this.options.sid);
                    const output = yield this.exec(adbCmd);
                    conprint_1.default.info(output);
                }
                catch (e) {
                    e = parse_error_1.default(e);
                    conprint_1.default.error(e.message);
                }
                return;
            }
            let deviceIp;
            try {
                deviceIp = yield ipManager.getDeviceIp();
            }
            catch (e) {
                conprint_1.default.error(e.message);
                return;
            }
            if (utils_1.no(deviceIp)) {
                conprint_1.default.error(error_constants_1.EMPTY_DEVICE_IP_ADDRESS);
                return;
            }
            try {
                const hostIp = yield ipManager.getHostIpInNetwork(deviceIp);
                if (utils_1.no(hostIp)) {
                    conprint_1.default.error(error_constants_1.NO_HOST_IP_IN_NETWORK);
                    return;
                }
                if (config_1.default.isDev()) {
                    console.log('>> device ip: ', deviceIp);
                    console.log('>> host ip:', hostIp);
                }
                if (yield ipManager.checkAreIPsInSameNetwork(deviceIp, hostIp)) {
                    // => Same network
                    try {
                        /*const result =*/
                        yield this.listenTcp();
                        yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield ask_input_1.default('done', 'Unplug usb and press ENTER/RETURN');
                            yield this.connectDeviceIp(deviceIp);
                        }), 400);
                    }
                    catch (e) {
                        conprint_1.default.error(parse_error_1.default(e).message);
                        return;
                    }
                }
                else {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new DifferentNetworksError_1.default();
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e).message);
            }
        });
    }
    listenTcp() {
        return __awaiter(this, void 0, void 0, function* () {
            let output = '';
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const adbTcpipCmd = yield build_adb_command_1.default(`tcpip ${config_1.default.PORT_TCP}`, this.options.sid);
                spawn_shell_cmd_1.default(adbTcpipCmd, {
                    close: (code, signal) => __awaiter(this, void 0, void 0, function* () {
                        if (code !== 0) {
                            // Wrong exit code
                            throw new ShellExitError_1.default(code);
                        }
                        resolve({ code, output });
                    }),
                    error: function (e) {
                        reject(e);
                    },
                    stderr: function (stream, stderr) {
                        reject(new Error(stderr));
                    },
                    stdout: function (stream, tcpipOutput) {
                        return __awaiter(this, void 0, void 0, function* () {
                            output += tcpipOutput;
                            conprint_1.default.info(tcpipOutput);
                        });
                    },
                });
            }));
        });
    }
    connectDeviceIp(deviceIp) {
        return __awaiter(this, void 0, void 0, function* () {
            let _output = '';
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const adbConnectCmd = yield build_adb_command_1.default(`connect ${deviceIp}:${config_1.default.PORT_TCP}`, this.options.sid);
                spawn_shell_cmd_1.default(adbConnectCmd, {
                    close: function (code, signal) {
                        if (code !== 0) {
                            throw new ShellExitError_1.default(code);
                        }
                        resolve({ code, output: _output });
                    },
                    error: function (e) {
                        reject(e);
                    },
                    stderr: function (stream, stderr) {
                        reject(new Error(stderr));
                    },
                    stdout: function (stream, output) {
                        // Connected.
                        _output += output;
                        store_1.default.saveWifiIp(deviceIp);
                        conprint_1.default.info(output);
                    },
                });
            }));
        });
    }
}
exports.default = WifiCommand;
