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
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config/config"));
class ScreenshotCommand extends BaseCommand_1.default {
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
                const formattedDate = moment_1.default().format('YYYYMMDD_hhmmss_SSSS');
                let fileName = `Screenshot_${formattedDate}.png`;
                let shellCommand = yield build_adb_command_1.default(`exec-out screencap -p > ${fileName}`, this.options.sid);
                const result = yield exec_shell_cmd_1.default(shellCommand);
                const dest = path_1.default.resolve(__dirname, fileName);
                conprint_1.default.info(`Your screenshot image file is saved at ${dest}`);
                conprint_1.default.info(result);
                if (true === this.options.open) {
                    if (config_1.default.isWindowsOs) {
                        conprint_1.default.notice('"open" option is currently not available for Windows');
                        return;
                    }
                    console.log('Opening file...');
                    yield exec_shell_cmd_1.default(`open "./${fileName}"`);
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e));
            }
        });
    }
}
exports.default = ScreenshotCommand;
