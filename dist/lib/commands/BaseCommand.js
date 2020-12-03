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
const config_1 = __importDefault(require("../../config/config"));
const utils_1 = require("../helpers/utils");
class BaseCommand {
    constructor(commandInfo) {
        this.args = [];
        this.options = {
            verbose: false,
        };
        this.commandInfo = commandInfo;
        this.name = commandInfo.name;
        this.args = commandInfo.args;
        this.options = commandInfo.options;
    }
    getArg1() {
        return this.args[0] || '';
    }
    isArg1AFilterDirective() {
        if (this.getArg1() !== null) {
            return config_1.default.filterDirectiveRegex.test(this.getArg1());
        }
    }
    /**
     * Resolves argument filters for the case where a filter directive is used.
     * @protected
     */
    checkResolveArgFilter() {
        for (let arg of this.args) {
            if (utils_1.no(this.options.filter) && config_1.default.filterDirectiveRegex.test(arg)) {
                // => Filter directive used for this arg. Use this as the filter.
                this.options.filter = arg.replace(config_1.default.filterDirectiveRegex, '');
                break;
            }
        }
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
                s: ` | ${config_1.default.cmd.grep} "${this.options.filter}" || exit 0`,
            },
        ]);
    }
}
exports.default = BaseCommand;
