#!/usr/bin/env node
'use strict';

const path = require('path');
const { runCli } = require('../lib/installer');

const code = runCli(process.argv.slice(2), {
  pkgRoot: path.resolve(__dirname, '..'),
  cwd: process.cwd(),
  env: process.env,
  invokedAs: path.basename(process.argv[1] || ''),
});

process.exit(code);
