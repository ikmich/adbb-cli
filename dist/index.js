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
    // @ts-ignore
    .options(yargs_options_1.default)
    .options({
    package: {},
})
    .help().argv;
const commandInfo = args_parser_1.default.parse(argv);
command_dispatcher_1.default.dispatch(commandInfo).catch(err => {
    console.error(err);
});
// console.log('>> process.argv:', process.argv);
// console.log('>> argv:', argv);
