#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const node_fs_1 = require("node:fs");
const index_1 = require("./index");
const { values: { filename, cwd, output, help }, } = (0, node_util_1.parseArgs)({
    options: {
        filename: {
            type: 'string',
            short: 'f',
            default: 'tsconfig.json',
        },
        cwd: {
            type: 'string',
            short: 'c',
            default: process.cwd(),
        },
        output: {
            type: 'string',
            short: 'o',
        },
        help: {
            type: 'boolean',
            short: 'h',
            default: false,
        },
    },
});
if (help) {
    console.log(`
Usage: tsconfig-to-swcconfig [options]
Alias: t2s [options]

Options:
  -f, --filename <filename>  filename to tsconfig (default: "tsconfig.json")
  -c, --cwd <cwd>            cwd (default: "${process.cwd()}")
  -o, --output <output>      output file (default: stdout)
  -h, --help                 display help for command
`);
    process.exit(0);
}
const swcConfig = (0, index_1.convert)(filename, cwd);
if (output) {
    (0, node_fs_1.writeFile)(output, JSON.stringify(swcConfig, null, 2), (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
}
else {
    console.log(JSON.stringify(swcConfig, null, 2));
    process.exit(0);
}
