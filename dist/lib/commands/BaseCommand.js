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
const store_1 = __importDefault(require("../helpers/store"));
const get_devices_1 = __importDefault(require("../helpers/get-devices"));
const ask_select_device_1 = __importDefault(require("../ask/ask-select-device"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const command_constants_1 = require("../../command-constants");
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
    isDisconnectAction() {
        const has_disconnect_arg = this.args.some(arg => {
            return arg === 'disconnect';
        });
        const has_disconnect_option = utils_1.yes(this.options.disconnect);
        return has_disconnect_arg || has_disconnect_option;
    }
    isSidRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            const is_devices_command = this.name === 'devices';
            const is_disconnect_action = this.isDisconnectAction();
            const is_set_pkg = [command_constants_1.CMD_SET_PACKAGE, command_constants_1.CMD_SET_PKG].includes(this.name);
            const is_unset_pkg = [command_constants_1.CMD_UNSET_PACKAGE, command_constants_1.CMD_UNSET_PKG].includes(this.name);
            return !is_devices_command && !is_disconnect_action && !is_set_pkg && !is_unset_pkg;
        });
    }
    /**
     * Executes actions to run the command. If multiple devices are connected, the base implementation handles logic
     * to obtain the target device to be used for the current command execution path. Hence it is strongly advised that
     * any implementing subclass calls `super.run()` before executing other actions.
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let targetSid = '';
            if (utils_1.no(this.options.sid)) {
                const devices = yield get_devices_1.default();
                if (devices.length > 1) {
                    if (yield this.isSidRequired()) {
                        conprint_1.default.notice('Multiple devices/emulators connected.');
                        targetSid = yield ask_select_device_1.default();
                    }
                }
                else {
                    targetSid = this.options.sid;
                }
            }
            if (utils_1.yes(targetSid)) {
                store_1.default.saveTargetSid(targetSid);
            }
            else {
                store_1.default.clearTargetSid();
            }
        });
    }
    done() {
        store_1.default.clearTargetSid();
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
