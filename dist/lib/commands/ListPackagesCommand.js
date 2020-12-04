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
const build_adb_command_1 = __importDefault(require("../helpers/build-adb-command"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const utils_1 = require("../helpers/utils");
const parse_error_1 = __importDefault(require("../errors/parse-error"));
class ListPackagesCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this);
            let shellCmd = yield build_adb_command_1.default('shell pm list packages', this.options.sid);
            if (utils_1.no(this.options.filter)) {
                // The first command is the package filter
                let filterArg = this.args[0];
                if (utils_1.yes(filterArg)) {
                    // Remove filter directive if exists
                    filterArg = filterArg.replace(/^[:*]+/, '');
                    this.options.filter = filterArg;
                }
            }
            shellCmd = this.applyFilter(shellCmd);
            try {
                const output = yield this.exec(shellCmd);
                if (utils_1.yes(output)) {
                    conprint_1.default.info(output);
                }
                else {
                    conprint_1.default.notice('No results');
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e).message);
            }
        });
    }
}
exports.default = ListPackagesCommand;
