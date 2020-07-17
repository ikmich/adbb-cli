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
const UndefinedNetworkConfigError_1 = __importDefault(require("../errors/UndefinedNetworkConfigError"));
const NetConfig_1 = __importDefault(require("./NetConfig"));
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const config_1 = __importDefault(require("../../config/config"));
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const constants_1 = require("../../constants");
const utils_1 = require("../helpers/utils");
const HostNotConnectedError_1 = __importDefault(require("../errors/HostNotConnectedError"));
const DeviceNotConnectedError_1 = __importDefault(require("../errors/DeviceNotConnectedError"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const spawn_shell_cmd_1 = __importDefault(require("../helpers/spawn-shell-cmd"));
const console_print_1 = __importDefault(require("../helpers/console-print"));
const chalk = require("chalk");
class IpManager {
    getDeviceNetworkConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            let commandString = 'shell ip -f inet addr | grep inet';
            let shellCommand = yield build_adb_command_1.default(commandString);
            let netConfigs = [];
            try {
                let cmdOutput = yield exec_shell_cmd_1.default(shellCommand);
                let rexConfigString = /(inet \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,3}\s+.*scope\s+\w+\s+\w+$)/gim;
                let allConfigsMatches = cmdOutput.match(rexConfigString);
                if (allConfigsMatches && allConfigsMatches.length > 0) {
                    allConfigsMatches.forEach((configString, idx) => {
                        if (config_1.default.isDev()) {
                            // console.log(`>> config: ${idx}`, configString);
                        }
                        let rex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,3})\s+.*scope\s+(\w+)\s+(\w+$)/i;
                        let singleConfigMatches = configString.match(rex);
                        if (singleConfigMatches && singleConfigMatches.length > 0) {
                            let ip = singleConfigMatches[1].replace(/\/\d{1,3}$/, '');
                            let scope = singleConfigMatches[2];
                            let netInterface = singleConfigMatches[3];
                            netConfigs.push(new NetConfig_1.default(ip, scope, netInterface));
                            if (config_1.default.isDev()) {
                                // console.log(`>> matches ${idx}:`, singleConfigMatches);
                                // console.log('\n');
                            }
                        }
                    });
                }
            }
            catch (e) {
                throw parse_error_1.default(e);
            }
            return netConfigs;
        });
    }
    getDeviceIp() {
        return __awaiter(this, void 0, void 0, function* () {
            let networkConfigs = yield this.getDeviceNetworkConfigs();
            if (!networkConfigs) {
                throw new UndefinedNetworkConfigError_1.default();
            }
            let choiceConfig = null;
            let hasWlanInterface = false;
            let hasRmnetInterface = false;
            // Priority 1 : 'wlan'
            for (let nc of networkConfigs) {
                if (/wlan/.test(nc.netInterface) && nc.scope != 'lo') {
                    hasWlanInterface = true;
                    choiceConfig = nc;
                    break;
                }
            }
            // Priority 2: 'rmnet'
            if (!choiceConfig) {
                for (let nc of networkConfigs) {
                    if (/rmnet/.test(nc.netInterface) && nc.scope != 'lo') {
                        hasRmnetInterface = true;
                        choiceConfig = nc;
                        break;
                    }
                }
            }
            if (choiceConfig) {
                return Promise.resolve(choiceConfig.ip);
            }
            // No network config.
            throw new DeviceNotConnectedError_1.default();
        });
    }
    getHostIps() {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = '';
            try {
                let ifconfig = yield exec_shell_cmd_1.default('ifconfig | grep inet');
                let rexConfigs = /inet (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gim;
                let configLineMatches = ifconfig.match(rexConfigs);
                for (let configLine of configLineMatches) {
                    if (configLine.indexOf(constants_1.LOOPBACK_ADDRESS) > -1) {
                        continue;
                    }
                    let rexIp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i;
                    let ipResults = configLine.match(rexIp) || [];
                    return ipResults;
                }
            }
            catch (e) {
                console.log(chalk.red(`Could not get host ip: ${e.message}`));
                throw parse_error_1.default(e);
            }
            if (utils_1.yes(ip)) {
                return ip;
            }
            throw new HostNotConnectedError_1.default();
        });
    }
    getHostIpInNetwork(referenceIp) {
        return __awaiter(this, void 0, void 0, function* () {
            let hostIps = yield this.getHostIps();
            for (let hostIp of hostIps) {
                if (this.checkAreIPsInSameNetwork(hostIp, referenceIp)) {
                    return hostIp;
                }
            }
            // No host ip is in same network as device.
            return '';
        });
    }
    checkAreIPsInSameNetwork(ip1, ip2) {
        const ip1Parts = ip1.split('.');
        const ip2Parts = ip2.split('.');
        return ip1Parts[0] === ip2Parts[0] && ip1Parts[1] === ip2Parts[1] && ip1Parts[2] === ip2Parts[2];
    }
    /**
     * Pings an ip address
     * @param ip
     */
    ping(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let output = '';
                try {
                    let childProcess = spawn_shell_cmd_1.default(`ping -c ${config_1.default.PING_COUNT} ${ip}`, {
                        close: function (code, p2) {
                            if (code === 0) {
                                let lines = output.split(/\n|\r\n/);
                                // First line is a summary info line, and not relevant in ping results for calculating timeout rate
                                lines.splice(0, 1);
                                let timeoutPct;
                                let timeouts = 0;
                                // Calculate timeout rate
                                lines.forEach(line => {
                                    if (/timeout/.test(line)) {
                                        ++timeouts;
                                    }
                                });
                                timeoutPct = Math.round((timeouts / lines.length) * 100);
                                const resultPayload = { output, childProcess, timeoutPct };
                                resolve(resultPayload);
                            }
                            else {
                                // Wrong exit code
                                console_print_1.default.notice(`Exited with code ${code}`);
                                reject({
                                    code,
                                    message: `Exited with code ${code}`,
                                });
                            }
                        },
                        error: function (e) {
                            reject(e);
                        },
                        // message: function(ser: Serializable, sh: SendHandle) {},
                        stderr: function (stream, stderr) {
                            reject(new Error(stderr));
                        },
                        stdout: function (stream, stdout) {
                            output += stdout;
                            // Print ping result line
                            console_print_1.default.info(utils_1.removeEndLines(stdout, 1));
                        },
                    });
                }
                catch (e) {
                    console_print_1.default.error(e.message);
                }
            });
        });
    }
}
exports.default = IpManager;
