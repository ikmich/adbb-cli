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
const utils_1 = require("../helpers/utils");
const ask_enter_package_1 = __importDefault(require("../ask/ask-enter-package"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const store_1 = __importDefault(require("../helpers/store"));
const ask_input_1 = __importDefault(require("../ask/ask-input"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const ask_select_package_1 = __importDefault(require("../ask/ask-select-package"));
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
class UninstallCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkResolveArgFilter();
            let pkg = '';
            let pkgs = [];
            switch (true) {
                case utils_1.yes(this.options.package):
                    pkg = this.options.package;
                    pkgs.push(pkg);
                    break;
                case utils_1.yes(this.options.filter):
                    pkgs = yield ask_select_package_1.default(this.options.filter, this.options.sid);
                    break;
                case utils_1.yes(this.args[0]):
                    pkg = this.args[0];
                    pkgs.push(pkg);
                    break;
                default:
                    // Check if a reference package has previously been set
                    if (store_1.default.hasPackage()) {
                        const answer = yield ask_input_1.default('confirm', `This application: "${store_1.default.getPackage()}" will be uninstalled. WOULD YOU LIKE TO CONTINUE? (y/n)`);
                        if (utils_1.yes(answer) && answer.toLowerCase() === 'y') {
                            pkg = store_1.default.getPackage();
                            pkgs.push(pkg);
                        }
                    }
                    if (utils_1.no(pkg)) {
                        pkg = yield ask_enter_package_1.default();
                        pkgs.push(pkg);
                    }
                    break;
            }
            if (!utils_1.isEmpty(pkgs)) {
                let i = 0;
                for (let pkg of pkgs) {
                    try {
                        conprint_1.default.plain(`Running ${++i} of ${pkgs.length}...`);
                        let adbCmdString = `uninstall ${pkg}`;
                        let shellCmd = yield build_adb_command_1.default(adbCmdString, this.options.sid);
                        const output = yield this.exec(shellCmd);
                        conprint_1.default.info(output);
                    }
                    catch (e) {
                        e = parse_error_1.default(e);
                        conprint_1.default.error(e.message);
                    }
                }
                conprint_1.default.info('DONE');
            }
        });
    }
}
exports.default = UninstallCommand;
