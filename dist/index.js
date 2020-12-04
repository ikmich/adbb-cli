#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const args_parser_1 = __importDefault(require("./lib/helpers/args-parser"));
const command_dispatcher_1 = __importDefault(require("./lib/helpers/command-dispatcher"));
const yargs_options_1 = __importDefault(require("./yargs-options"));
const yargs_1 = __importDefault(require("yargs"));
const command_constants_1 = require("./command-constants");
const argv = yargs_1.default
    .command(command_constants_1.CMD_DEVICES, 'List connected devices')
    .command(command_constants_1.CMD_PACKAGES, 'List installed packages')
    .alias(command_constants_1.CMD_PKGS, command_constants_1.CMD_PACKAGES)
    .command(command_constants_1.CMD_WIFI, 'Connect the device via wifi')
    .command(command_constants_1.CMD_CLEAR, 'Clear data for application')
    .command(command_constants_1.CMD_EMULATOR, 'Start an emulator. Shows available emulators for user to select')
    .alias(command_constants_1.CMD_EMULATOR, command_constants_1.CMD_EMU)
    .command(command_constants_1.CMD_IP, 'Show the device IP address(es)')
    .command(command_constants_1.CMD_RESET_SERVER, 'Reset adb server')
    .command(command_constants_1.CMD_SCREENSHOT, 'Take screenshot of the device screen')
    .command(command_constants_1.CMD_PATH, 'Get path of installed application package')
    .command(command_constants_1.CMD_PING, 'Ping the device ip address to check the wifi connection')
    .command(command_constants_1.CMD_UNSET_PACKAGE, 'Unset currently set default reference package')
    .alias(command_constants_1.CMD_UNSET_PACKAGE, command_constants_1.CMD_UNSET_PKG)
    .command(command_constants_1.CMD_SET_PACKAGE, 'Set default reference package for commands')
    .alias(command_constants_1.CMD_SET_PACKAGE, command_constants_1.CMD_SET_PKG)
    .command(command_constants_1.CMD_RESET_SERVER, 'Reset the adb connection')
    .command(command_constants_1.CMD_UNINSTALL, 'Uninstall an application')
    .options(yargs_options_1.default)
    .help().argv;
const commandInfo = args_parser_1.default.parse(argv);
command_dispatcher_1.default.dispatch(commandInfo).catch(err => {
    console.error(err);
});
// console.log('>> process.argv:', process.argv);
// console.log('>> argv:', argv);
