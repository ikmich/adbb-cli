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
const exec_shell_cmd_1 = __importDefault(require("./exec-shell-cmd"));
const build_adb_command_1 = __importDefault(require("./build-adb-command"));
const utils_1 = require("./utils");
const console_print_1 = __importDefault(require("./console-print"));
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const getPackages = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let results = [];
        let adbCommand = yield build_adb_command_1.default(`shell pm list packages`);
        if (utils_1.yes(filter)) {
            adbCommand += ` | grep -i ${filter} || exit 0`;
        }
        let output = yield exec_shell_cmd_1.default(adbCommand);
        // separate each line with comma
        output = output.replace(/(\n+|\r\n+)/gim, ',');
        // split by comma
        if (/,+/.test(output)) {
            results = output.split(',');
        }
        else {
            results.push(output);
        }
        results = results.map((line) => {
            return line.replace(/^package:/, '');
        });
        return results;
    }
    catch (e) {
        console_print_1.default.error(parse_error_1.default(e));
        return [];
    }
});
exports.default = getPackages;
