'use strict';

/**
 * Write package.json's version into every manifest and prose stamp listed
 * in version-targets.js. npm runs this from the "version" lifecycle script,
 * so `npm version <x>` produces one commit with every stamp updated.
 * Pass --git-add to stage exactly the files this script owns.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { JSON_TARGETS, PROSE_TARGETS, SEMVER, pick } = require('./version-targets');

const ROOT = path.resolve(__dirname, '..');
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const changed = [];

function update(rel, next) {
  const file = path.join(ROOT, rel);
  const text = fs.readFileSync(file, 'utf8');
  const out = next(text);
  if (out !== text) {
    fs.writeFileSync(file, out);
    changed.push(rel);
  }
}

for (const [rel, keys] of JSON_TARGETS) {
  update(rel, (text) => {
    const old = pick(JSON.parse(text), keys);
    if (typeof old !== 'string') throw new Error(`${rel}: no version at ${keys.join('.')}`);
    if (old === version) return text;
    // Rewrite the "version" field text in place so formatting is preserved.
    const field = new RegExp(`("version"\\s*:\\s*")${old.replace(/\./g, '\\.')}(")`, 'g');
    const out = text.replace(field, `$1${version}$2`);
    if (pick(JSON.parse(out), keys) !== version) {
      throw new Error(`${rel}: could not rewrite ${keys.join('.')} from ${old}`);
    }
    return out;
  });
}

for (const rel of PROSE_TARGETS) {
  update(rel, (text) => text.replace(SEMVER, version));
}

process.stdout.write(changed.length ? `stamped ${version}: ${changed.join(', ')}\n` : `stamps already at ${version}\n`);

if (process.argv.includes('--git-add') && changed.length) {
  const added = spawnSync('git', ['add', '--', ...changed], { cwd: ROOT, stdio: 'inherit' });
  if (added.status !== 0) process.exit(added.status || 1);
}
