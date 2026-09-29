'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

test('eval tasks are sound: hidden tests fail on the start and pass on the reference', () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'eval', 'run.js'), '--self-test'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`);
  assert.match(r.stdout, /eval self-test ok/);
});
