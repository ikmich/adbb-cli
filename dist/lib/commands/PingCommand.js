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
const parse_error_1 = __importDefault(require("../errors/parse-error"));
const IpManager_1 = __importDefault(require("../core/IpManager"));
class PingCommand extends BaseCommand_1.default {
    constructor(commandInfo) {
        super(commandInfo);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ping the device ip to "wake up" the connection (in case it's in lazy mode)
                const ipManager = new IpManager_1.default();
                const deviceIp = yield ipManager.getDeviceIp();
                const pingResults = yield ipManager.ping(deviceIp);
                const { timeoutPct } = pingResults;
                switch (true) {
                    case timeoutPct >= 0 && timeoutPct < 5: {
                        conprint_1.default.success(`pct timeout: ${timeoutPct}%`);
                        break;
                    }
                    case timeoutPct >= 5 && timeoutPct < 20: {
                        conprint_1.default.notice(`pct timeout: ${timeoutPct}%`);
                        break;
                    }
                    default:
                        conprint_1.default.error(`pct timeout: ${timeoutPct}%`);
                        break;
                }
            }
            catch (e) {
                conprint_1.default.error(parse_error_1.default(e).message);
            }
        });
    }
}
exports.default = PingCommand;
