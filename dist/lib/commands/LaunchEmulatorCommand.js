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
const exec_shell_cmd_1 = __importDefault(require("../helpers/exec-shell-cmd"));
const get_emulators_1 = __importDefault(require("../helpers/get-emulators"));
const ask_select_emulator_1 = __importDefault(require("../ask/ask-select-emulator"));
const conprint_1 = __importDefault(require("../helpers/conprint"));
const chalk = require("chalk");
class LaunchEmulatorCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emulators = yield get_emulators_1.default();
                if (this.options.list) {
                    // Display list of emulators.
                    if (emulators && emulators.length > 0) {
                        let lines = [];
                        for (let emulator of emulators) {
                            lines.push(emulator);
                        }
                        conprint_1.default.plain('Available emulators:');
                        conprint_1.default.info(lines.join('\n'));
                        return;
                    }
                }
                let emulator = '';
                if (emulators && emulators.length > 0) {
                    console.log(chalk.blue('Multiple emulators available'));
                    emulator = yield ask_select_emulator_1.default();
                }
                else {
                    emulator = emulators[0];
                }
                // Run command to launch emulator
                const output = yield exec_shell_cmd_1.default(`emulator @${emulator}`);
                console.log(output);
            }
            catch (e) {
                console.log(chalk.red(`Could not run command ${this.name}: ${e.message}`));
            }
        });
    }
}
exports.default = LaunchEmulatorCommand;
