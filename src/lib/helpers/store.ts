import { yes } from './utils.js';
import config from '../../config/config.js';
import {
  STORE_LAST_PKG_NOTICE_TIME,
  STORE_LAST_RECORDING,
  STORE_LAST_WIFI_IP,
  STORE_REF_PACKAGE,
  STORE_TARGET_SID,
} from '../../constants.js';

import { Schema } from 'conf';
import Conf from 'conf';

const conf = new Conf.default({
  schema: config.storeSchema as Schema<any>,
  projectName: 'adbb',
});

const store = {
  save(key, value) {
    conf.set(key, value);
  },

  get(key, defaultValue?: any) {
    return conf.get(key, defaultValue);
  },

  del(key) {
    conf.delete(key);
  },

  clear() {
    conf.clear();
  },

  // ====

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
    return conf.get(STORE_LAST_PKG_NOTICE_TIME, 0) as number;
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

  saveTargetSid(sid: string) {
    this.save(STORE_TARGET_SID, sid);
  },

  getTargetSid(): string {
    return (<string>this.get(STORE_TARGET_SID) || '').trim();
  },

  clearTargetSid() {
    this.del(STORE_TARGET_SID);
  },

  saveLastRecording(path: string) {
    this.save(STORE_LAST_RECORDING, path);
  },

  getLastRecording(): string {
    return this.get(STORE_LAST_RECORDING) ?? '';
  },

  clearLastRecording() {
    this.del(STORE_LAST_RECORDING);
  },
};

export default store;
