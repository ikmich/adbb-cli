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
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../helpers/utils");
const askSelect = (name = 'choice', message = 'Select choice', choices, multiple = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (choices && choices.length > 0) {
        const result = yield inquirer_1.default.prompt({
            type: utils_1.yes(multiple) ? 'checkbox' : 'list',
            name,
            message,
            choices,
        });
        return result[name] || '';
    }
    return '';
});
exports.default = askSelect;
