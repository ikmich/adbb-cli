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
const WifiCommand_1 = __importDefault(require("../commands/WifiCommand"));
const DevicesCommand_1 = __importDefault(require("../commands/DevicesCommand"));
const ListPackagesCommand_1 = __importDefault(require("../commands/ListPackagesCommand"));
const get_command_args_string_1 = __importDefault(require("./get-command-args-string"));
const ClearCommand_1 = __importDefault(require("../commands/ClearCommand"));
const exec_shell_cmd_1 = __importDefault(require("./exec-shell-cmd"));
const LaunchEmulatorCommand_1 = __importDefault(require("../commands/LaunchEmulatorCommand"));
const IpCommand_1 = __importDefault(require("../commands/IpCommand"));
const ResetServerCommand_1 = __importDefault(require("../commands/ResetServerCommand"));
const command_constants_1 = require("../../command-constants");
const conprint_1 = __importDefault(require("./conprint"));
const PackageCommand_1 = __importDefault(require("../commands/PackageCommand"));
const store_1 = __importDefault(require("./store"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const UninstallCommand_1 = __importDefault(require("../commands/UninstallCommand"));
const PingCommand_1 = __importDefault(require("../commands/PingCommand"));
const utils_1 = require("./utils");
const PathCommand_1 = __importDefault(require("../commands/PathCommand"));
const ScreenshotCommand_1 = __importDefault(require("../commands/ScreenshotCommand"));
const commandDispatcher = {
    dispatch: (commandInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (store_1.default.hasPackage() && store_1.default.shouldShowPkgNotice()) {
            conprint_1.default.notice(`Current reference package: ${store_1.default.getPackage()}`);
            store_1.default.savePkgNoticeTime();
        }
        // If no argument and no options,
        if (utils_1.no(commandInfo.name)) {
            if (utils_1.isEmpty(commandInfo.options) || utils_1.arrayContainsAnyOf(Object.keys(commandInfo.options), ['g', 'j', 'v'])) {
                commandInfo.name = command_constants_1.CMD_DEVICES;
            }
        }
        let mainCommand = commandInfo.name;
        switch (true) {
            case /rm\s+/.test(mainCommand):
            case /rmdir\s+/.test(mainCommand):
            case /del\s+/.test(mainCommand):
                return;
        }
        switch (mainCommand) {
            case command_constants_1.CMD_DEVICES:
                yield new DevicesCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_PACKAGES:
            case command_constants_1.CMD_PKGS:
                yield new ListPackagesCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_WIFI:
                yield new WifiCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_CLEAR:
                yield new ClearCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_EMU:
            case command_constants_1.CMD_EMULATOR:
                yield new LaunchEmulatorCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_IP:
                yield new IpCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_RESET_SERVER:
                yield new ResetServerCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_PACKAGE:
            case command_constants_1.CMD_PKG:
                yield new PackageCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_UNSET_PKG:
            case command_constants_1.CMD_UNSET_PACKAGE:
                yield new PackageCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_UNINSTALL:
                yield new UninstallCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_PING:
                yield new PingCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_PATH:
                yield new PathCommand_1.default(commandInfo).run();
                break;
            case command_constants_1.CMD_SCREENSHOT:
            case command_constants_1.CMD_SCRSHOT: {
                yield new ScreenshotCommand_1.default(commandInfo).run();
                break;
            }
            default:
                const cliCommand = yield get_command_args_string_1.default();
                if (cliCommand) {
                    if (cliCommand === 'shell') {
                        conprint_1.default.notice(`NOTICE: Run "adb shell" in your terminal`);
                        break;
                    }
                    conprint_1.default.info('Running regular adb command...');
                    try {
                        const shellCmd = `adb ${cliCommand}`;
                        const output = yield exec_shell_cmd_1.default(shellCmd);
                        console.log(output);
                    }
                    catch (e) {
                        conprint_1.default.error(parse_error_1.default(e).message);
                    }
                }
                else {
                    // console.log(chalk.red(`No such command: ${mainCommand}`));
                }
                break;
        }
    }),
};
exports.default = commandDispatcher;
