'use strict';

/**
 * package.json is the only version source. Every manifest and the prose
 * version stamps must match it. Banner text is rendered from package.json
 * at runtime and must not hardcode a version. `npm run stamp` fixes drift.
 */

const fs = require('fs');
const path = require('path');
const { JSON_TARGETS, PROSE_TARGETS, NO_VERSION, SEMVER, stampable, pick } = require('./version-targets');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const version = pkg.version;
const failures = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

for (const [rel, keys] of JSON_TARGETS) {
  const found = pick(JSON.parse(read(rel)), keys);
  if (found !== version) {
    failures.push(`${rel}: expected ${version}, found ${found}`);
  }
}

for (const rel of PROSE_TARGETS) {
  const found = stampable(read(rel)).match(SEMVER) || [];
  if (!found.includes(version)) {
    failures.push(`${rel}: does not mention ${version}`);
  }
  for (const hit of found) {
    if (hit !== version) failures.push(`${rel}: stray version ${hit} (run npm run stamp)`);
  }
}

for (const rel of NO_VERSION) {
  const found = read(rel).match(SEMVER) || [];
  for (const hit of found) {
    failures.push(`${rel}: hardcoded version ${hit} (read package.json instead)`);
  }
}

if (!String(pkg.engines && pkg.engines.node || '').includes('>=22')) {
  failures.push('package.json engines.node must require >=22');
}

if (failures.length) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(`versions ok (${version})\n`);
