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
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const if_concat_1 = __importDefault(require("../helpers/if-concat"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
class BaseCommand {
    constructor(commandInfo) {
        this.args = [];
        this.options = {
            verbose: false,
        };
        /**
         * Override this in sub class to prevent default printing of error in console
         * */
        this.printError = true;
        /**
         * Override this in sub class to prevent default printing of output in console
         */
        this.printOutput = false;
        this.commandInfo = commandInfo;
        this.name = commandInfo.name;
        this.args = commandInfo.args;
        this.options = commandInfo.options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    exec(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield exec_shell_cmd_1.default(cmd);
            }
            catch (e) {
                throw parse_error_1.default(e);
            }
        });
    }
    /**
     * Use to filter the command output. Should be called AFTER the other command options have been applied to the
     * string.
     * @param cmd
     */
    applyFilter(cmd) {
        return if_concat_1.default(cmd, [
            {
                c: typeof this.options.filter !== 'undefined' && this.options.filter !== null,
                s: ` | grep "${this.options.filter}" || exit 0`,
            },
        ]);
    }
}
exports.default = BaseCommand;
