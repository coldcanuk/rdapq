'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JSON_TARGETS, PROSE_TARGETS, NO_VERSION } = require('../scripts/version-targets');

const REPO = path.resolve(__dirname, '..');

function copy(rel, root) {
  const dest = path.join(root, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(REPO, rel), dest);
}

test('stamp-version moves every target to the package version and check-versions agrees', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-stamp-'));
  const files = [
    'package.json',
    'scripts/version-targets.js',
    'scripts/stamp-version.js',
    'scripts/check-versions.js',
    ...JSON_TARGETS.map(([rel]) => rel),
    ...PROSE_TARGETS,
    ...NO_VERSION,
  ];
  for (const rel of files) copy(rel, root);

  fs.appendFileSync(path.join(root, 'README.md'), '\nMeasured on 0.9.1 <!-- keep-version -->\n');
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = '9.8.7';
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const stale = spawnSync(process.execPath, ['scripts/check-versions.js'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(stale.status, 0);

  const stamped = spawnSync(process.execPath, ['scripts/stamp-version.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(stamped.status, 0, stamped.stderr);
  assert.match(stamped.stdout, /stamped 9\.8\.7/);

  const checked = spawnSync(process.execPath, ['scripts/check-versions.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
  assert.match(checked.stdout, /versions ok \(9\.8\.7\)/);

  assert.match(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), /Measured on 0\.9\.1 <!-- keep-version -->/);

  const again = spawnSync(process.execPath, ['scripts/stamp-version.js'], { cwd: root, encoding: 'utf8' });
  assert.match(again.stdout, /already at 9\.8\.7/);
});
