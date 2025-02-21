#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { writeFile } from 'node:fs'
import { convert } from './index'

const {
  values: { filename, cwd, output, help },
} = parseArgs({
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
})

if (help) {
  console.log(`
Usage: tsconfig-to-swcconfig [options]
Alias: t2s [options]

Options:
  -f, --filename <filename>  filename to tsconfig (default: "tsconfig.json")
  -c, --cwd <cwd>            cwd (default: "${process.cwd()}")
  -o, --output <output>      output file (default: stdout)
  -h, --help                 display help for command
`)

  process.exit(0)
}

const swcConfig = convert(filename, cwd)

if (output) {
  writeFile(output, JSON.stringify(swcConfig, null, 2), (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
} else {
  console.log(JSON.stringify(swcConfig, null, 2))
  process.exit(0)
}
