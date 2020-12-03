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
const getEmulators = () => __awaiter(void 0, void 0, void 0, function* () {
    let results = [];
    const output = yield exec_shell_cmd_1.default('emulator -list-avds');
    const rexGlobal = /\w+/gim;
    const emulators = output.match(rexGlobal);
    if (emulators && emulators.length > 0) {
        results = emulators;
    }
    return results;
});
exports.default = getEmulators;
