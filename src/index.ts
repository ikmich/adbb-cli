#!/usr/bin/env node

import argsParser from './lib/helpers/args-parser';
import commandDispatcher from './lib/helpers/command-dispatcher';
import yargsOptions from './yargs-options';
import yargs from 'yargs';
import {
  CMD_CLEAR,
  CMD_DEVICES,
  CMD_EMU,
  CMD_EMULATOR,
  CMD_IP,
  CMD_PACKAGE,
  CMD_PACKAGES,
  CMD_PATH,
  CMD_PING,
  CMD_PKG,
  CMD_PKGS,
  CMD_RESET_SERVER,
  CMD_SCREENSHOT,
  CMD_UNINSTALL,
  CMD_UNSET_PACKAGE,
  CMD_UNSET_PKG,
  CMD_WIFI,
} from './command-constants';

const argv = yargs
  .command(CMD_DEVICES, 'List connected devices')
  .command(CMD_PACKAGES, 'List installed packages')
  .alias(CMD_PKGS, CMD_PACKAGES)
  .command(CMD_WIFI, 'Connect the device via wifi')
  .command(CMD_CLEAR, 'Clear data for application')
  .command(CMD_EMULATOR, 'Start an emulator. Shows available emulators for user to select')
  .alias(CMD_EMULATOR, CMD_EMU)
  .command(CMD_IP, 'Show the device IP address(es)')
  .command(CMD_RESET_SERVER, 'Reset adb server')
  .command(CMD_SCREENSHOT, 'Take screenshot of the device screen')
  .command(CMD_PATH, 'Get path of installed application package')
  .command(CMD_PING, 'Ping the device ip address to check the wifi connection')
  .command(CMD_UNSET_PACKAGE, 'Unset currently set default reference package')
  .alias(CMD_UNSET_PACKAGE, CMD_UNSET_PKG)
  .command(CMD_PACKAGE, 'Set default reference package for commands')
  .alias(CMD_PACKAGE, CMD_PKG)
  .command(CMD_RESET_SERVER, 'Reset the adb connection')
  .command(CMD_UNINSTALL, 'Uninstall an application')

  // @ts-ignore
  .options(yargsOptions)

  .options({
    package: {},
  })
  .help().argv;

const commandInfo = argsParser.parse(argv);
commandDispatcher.dispatch(commandInfo).catch(err => {
  console.error(err);
});

// console.log('>> process.argv:', process.argv);
// console.log('>> argv:', argv);
