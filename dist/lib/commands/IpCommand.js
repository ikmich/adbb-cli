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
const conprint_1 = __importDefault(require("../helpers/conprint"));
const IpManager_1 = __importDefault(require("../core/IpManager"));
const UndefinedNetworkConfigError_1 = __importDefault(require("../errors/UndefinedNetworkConfigError"));
const utils_1 = require("../helpers/utils");
const error_constants_1 = require("../errors/error-constants");
const parse_error_1 = __importDefault(require("../errors/parse-error"));
/**
 * Command to get the device's IP address.
 */
class IpCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this);
            try {
                const ipManager = new IpManager_1.default();
                const netConfigs = yield ipManager.getDeviceNetworkConfigs(this.options.sid);
                let output = '';
                if (netConfigs && netConfigs.length > 0) {
                    for (let netConfig of netConfigs) {
                        output += netConfig.ip + '\n';
                    }
                }
                else {
                    const e = new UndefinedNetworkConfigError_1.default();
                    conprint_1.default.error(e.message);
                    return;
                }
                output = output.replace(/\n+$/, '');
                if (utils_1.yes(output)) {
                    conprint_1.default.info('Device IP address(es):');
                    conprint_1.default.info(output);
                }
                else {
                    conprint_1.default.error(error_constants_1.NO_IP_ADDRESS_FOUND);
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e));
            }
        });
    }
}
exports.default = IpCommand;
