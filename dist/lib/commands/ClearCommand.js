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
const ask_enter_package_1 = __importDefault(require("../ask/ask-enter-package"));
const NoPackageError_1 = __importDefault(require("../errors/NoPackageError"));
const utils_1 = require("../helpers/utils");
const conprint_1 = __importDefault(require("../helpers/conprint"));
const store_1 = __importDefault(require("../helpers/store"));
const ask_select_package_1 = __importDefault(require("../ask/ask-select-package"));
class ClearCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this);
            this.checkResolveArgFilter();
            let pkgs = [];
            switch (true) {
                case utils_1.yes(this.options.package):
                    pkgs.push(this.options.package);
                    break;
                case utils_1.yes(this.options.filter):
                    pkgs = yield ask_select_package_1.default(this.options.filter, this.options.sid);
                    break;
                case utils_1.yes(this.args[0]):
                    pkgs.push(this.args[0]);
                    break;
                default:
                    // Check if a reference package has previously been set
                    if (store_1.default.hasPackage()) {
                        const pkg = store_1.default.getPackage();
                        pkgs.push(pkg);
                    }
                    else {
                        // Request for package
                        const pkg = yield ask_enter_package_1.default();
                        if (utils_1.yes(pkg) && pkg.trim() !== '') {
                            pkgs.push(pkg);
                        }
                        else {
                            throw new NoPackageError_1.default();
                        }
                    }
                    break;
            }
            try {
                if (!utils_1.isEmpty(pkgs)) {
                    let i = 0;
                    for (let pkg of pkgs) {
                        conprint_1.default.plain(`Running ${++i} of ${pkgs.length}`);
                        let adbCmdString = `shell pm clear ${pkg}`;
                        let shellCmd = yield build_adb_command_1.default(adbCmdString, this.options.sid);
                        const output = yield this.exec(shellCmd);
                        conprint_1.default.info(output);
                    }
                    conprint_1.default.info('DONE');
                }
            }
            catch (e) {
                conprint_1.default.error(e.message);
            }
        });
    }
}
exports.default = ClearCommand;
