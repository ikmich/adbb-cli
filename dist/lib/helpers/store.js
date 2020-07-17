"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const config_1 = __importDefault(require("../../config/config"));
const constants_1 = require("../../constants");
const Conf = require('conf');
const conf = new Conf({
    schema: config_1.default.storeSchema,
});
const store = {
    save(key, value) {
        conf.set(key, value);
    },
    get(key, value) {
        conf.get(key, value);
    },
    del(key) {
        conf.delete(key);
    },
    clear() {
        conf.clear();
    },
    // PACKAGES
    setPackage(packageName) {
        conf.set(constants_1.STORE_REF_PACKAGE, packageName);
    },
    getPackage() {
        return conf.get(constants_1.STORE_REF_PACKAGE);
    },
    hasPackage() {
        return utils_1.yes(conf.get(constants_1.STORE_REF_PACKAGE));
    },
    unsetPackage() {
        conf.delete(constants_1.STORE_REF_PACKAGE);
    },
    getLastPkgNoticeTime() {
        return conf.get(constants_1.STORE_LAST_PKG_NOTICE_TIME, 0);
    },
    savePkgNoticeTime() {
        conf.set(constants_1.STORE_LAST_PKG_NOTICE_TIME, new Date().getTime());
    },
    shouldShowPkgNotice() {
        const nowMs = new Date().getTime();
        const elapsed = nowMs - this.getLastPkgNoticeTime();
        const elapsedMins = Math.round(elapsed / 1000 / 60);
        return elapsedMins >= config_1.default.elapsed_mins_show_pkg_notice;
        // const elapsedSecs = Math.round(elapsed / 1000);
        // return elapsedSecs >= config.elapsed_secs_show_pkg_notice;
    },
    // WIFI
    saveWifiIp(ip) {
        conf.set(constants_1.STORE_LAST_WIFI_IP, ip);
    },
    getLastWifiIp() {
        return conf.get(constants_1.STORE_LAST_WIFI_IP);
    },
    hasWifiDevice() {
        return utils_1.yes(this.getLastWifiIp());
    },
};
exports.default = store;
