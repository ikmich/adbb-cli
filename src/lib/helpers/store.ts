import { yes } from './utils';
import config from '../../config/config';
import { STORE_LAST_PKG_NOTICE_TIME, STORE_LAST_WIFI_IP, STORE_REF_PACKAGE } from '../../constants';

const Conf = require('conf');

const conf = new Conf({
    schema: config.storeSchema,
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
    setPackage(packageName: string) {
        conf.set(STORE_REF_PACKAGE, packageName);
    },

    getPackage() {
        return conf.get(STORE_REF_PACKAGE);
    },

    hasPackage() {
        return yes(conf.get(STORE_REF_PACKAGE));
    },

    unsetPackage() {
        conf.delete(STORE_REF_PACKAGE);
    },

    getLastPkgNoticeTime(): number {
        return conf.get(STORE_LAST_PKG_NOTICE_TIME, 0);
    },

    savePkgNoticeTime() {
        conf.set(STORE_LAST_PKG_NOTICE_TIME, new Date().getTime());
    },

    shouldShowPkgNotice(): boolean {
        const nowMs = new Date().getTime();
        const elapsed = nowMs - this.getLastPkgNoticeTime();
        const elapsedMins = Math.round(elapsed / 1000 / 60);
        return elapsedMins >= config.elapsed_mins_show_pkg_notice;
        // const elapsedSecs = Math.round(elapsed / 1000);
        // return elapsedSecs >= config.elapsed_secs_show_pkg_notice;
    },

    // WIFI
    saveWifiIp(ip: string) {
        conf.set(STORE_LAST_WIFI_IP, ip);
    },

    getLastWifiIp() {
        return conf.get(STORE_LAST_WIFI_IP);
    },

    hasWifiDevice(): boolean {
        return yes(this.getLastWifiIp());
    },
};

export default store;
