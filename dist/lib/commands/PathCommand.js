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
const console_print_1 = __importDefault(require("../helpers/console-print"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const utils_1 = require("../helpers/utils");
const store_1 = __importDefault(require("../helpers/store"));
const ask_input_1 = __importDefault(require("../ask/ask-input"));
class PathCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pkg = '';
                switch (true) {
                    case store_1.default.hasPackage():
                        const answer = yield ask_input_1.default('confirm', `Show install path for: "${store_1.default.getPackage()}"? (y/n)`);
                        if (utils_1.yes(answer) && answer.toLowerCase() === 'y') {
                            pkg = store_1.default.getPackage();
                        }
                        break;
                    case utils_1.yes(this.args[0]):
                        pkg = this.args[0];
                        break;
                    case utils_1.yes(this.options.package):
                        pkg = this.options.package;
                        break;
                }
                if (utils_1.no(pkg)) {
                    console_print_1.default.error('No package specified');
                    return;
                }
                let cmd = yield build_adb_command_1.default(`shell pm path ${pkg}`);
                const output = yield this.exec(cmd);
                console_print_1.default.info(output);
            }
            catch (e) {
                console_print_1.default.error(parse_error_1.default(e).message);
                return;
            }
        });
    }
}
exports.default = PathCommand;
