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
const console_print_1 = __importDefault(require("../helpers/console-print"));
const ask_enter_package_1 = __importDefault(require("../ask/ask-enter-package"));
const store_1 = __importDefault(require("../helpers/store"));
const command_constants_1 = require("../../command-constants");
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const chalk = require("chalk");
class PackageCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    static unsetPkg() {
        store_1.default.unsetPackage();
        console_print_1.default.info('Reference package has been unset');
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.name) {
                case command_constants_1.CMD_UNSET_PACKAGE:
                case command_constants_1.CMD_UNSET_PKG:
                    store_1.default.unsetPackage();
                    PackageCommand.unsetPkg();
                    return;
            }
            switch (true) {
                case this.options.unset:
                case this.options.disconnect:
                    PackageCommand.unsetPkg();
                    return;
            }
            let packageName = null;
            switch (true) {
                case utils_1.yes(this.args[0]):
                    packageName = this.args[0];
                    break;
                case store_1.default.hasPackage():
                    // Show current package
                    console.log(`Reference package: ${chalk.blueBright(store_1.default.getPackage())}`);
                    break;
                default:
                    // Ask to enter the reference package.
                    packageName = yield ask_enter_package_1.default('Set reference package e.g com.package.app:');
                    break;
            }
            if (utils_1.yes(packageName)) {
                try {
                    store_1.default.setPackage(packageName);
                    console_print_1.default.info(`${packageName} is now the default package`);
                }
                catch (e) {
                    console_print_1.default.error(parse_error_1.default(e).message);
                }
            }
        });
    }
}
exports.default = PackageCommand;
