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
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
class ResetServerCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const output1 = yield exec_shell_cmd_1.default('adb kill-server');
                console_print_1.default.info(output1);
            }
            catch (e) {
                console_print_1.default.error(parse_error_1.default(e).message);
                return;
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const output2 = yield exec_shell_cmd_1.default('adb start-server');
                    console_print_1.default.info(output2);
                }
                catch (e) {
                    console_print_1.default.error(parse_error_1.default(e).message);
                }
            }), 200);
        });
    }
}
exports.default = ResetServerCommand;
