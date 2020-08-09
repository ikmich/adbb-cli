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
  CMD_PACKAGES,
  CMD_PKGS,
  CMD_RESET_SERVER,
  CMD_WIFI
} from "./command-constants";

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

    // @ts-ignore
    .options(yargsOptions)


    .options({
      package: {},
    })
    .help().argv;


const commandInfo = argsParser.parse(argv);
commandDispatcher.dispatch(commandInfo).then(() => {
});

// getDevices().then(result => {
//     console.log('>> devices output:', result);
// });


// console.log('>> process.argv:', process.argv);
// console.log('>> argv:', argv);

// console.log('>> cli command:', getCliCommandString());