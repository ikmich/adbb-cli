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
const get_packages_1 = __importDefault(require("../helpers/get-packages"));
const utils_1 = require("../helpers/utils");
const ask_select_multiple_1 = __importDefault(require("./ask-select-multiple"));
const ask_select_1 = __importDefault(require("./ask-select"));
/**
 * Asks user to select one or more packages from the list of packages that match the filter argument.
 * @param filter Filter string or filter directive
 * @param sid The device serial id
 */
const askSelectPackage = (filter, sid) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield get_packages_1.default(filter, sid);
    let pkgs = [];
    if (!utils_1.isEmpty(packages)) {
        if (packages.length > 1) {
            // Select multiple
            pkgs = yield ask_select_multiple_1.default('package', 'Select package', packages);
        }
        else {
            // Select single
            pkgs.push(yield ask_select_1.default('package', 'Select package', packages));
        }
    }
    return pkgs;
});
exports.default = askSelectPackage;
