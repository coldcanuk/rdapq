'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { main } = require('../rdap-q-skill/tool/rdapq');

const TOOL = path.join(__dirname, '..', 'rdap-q-skill', 'tool', 'rdapq.js');

function git(cwd, ...args) {
  const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t.invalid', ...args], { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

/** A tiny repo: src/add.js with a bug, a test that imports it, and a failing repro test. */
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-engine-'));
  fs.mkdirSync(path.join(root, 'src'));
  fs.mkdirSync(path.join(root, 'test'));
  fs.writeFileSync(path.join(root, 'src', 'add.js'), "module.exports = (a, b) => a - b;\n");
  fs.writeFileSync(path.join(root, 'test', 'add.test.js'), [
    "const test = require('node:test');",
    "const assert = require('node:assert/strict');",
    "const add = require('../src/add');",
    "test('adds', () => assert.equal(add(2, 3), 5));",
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(root, 'README.md'), 'fixture\n');
  git(root, 'init', '-q');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'init');
  return root;
}

function rdapq(root, args, extra = {}) {
  const lines = [];
  const errs = [];
  const code = main(args, { cwd: root, out: (l) => lines.push(l), err: (l) => errs.push(l), env: { ...process.env, RDAPQ_HOME: path.join(root, '.home') }, ...extra });
  return { code, out: lines.join('\n'), err: errs.join('\n') };
}

const fix = (root) => fs.writeFileSync(path.join(root, 'src', 'add.js'), "module.exports = (a, b) => a + b;\n");
const TEST_CMD = 'node --test test/*.test.js';

test('gate is CONTINUE before any check and UNCLEAR_TASK before start', () => {
  const root = fixture();
  assert.match(rdapq(root, ['gate']).out, /UNCLEAR_TASK/);
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  const g = rdapq(root, ['gate']);
  assert.equal(g.code, 3);
  assert.match(g.out, /CONTINUE/);
});

test('a real fix with an importing test reaches COMPLETE', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  const failing = rdapq(root, ['check']);
  assert.match(failing.out, /runtime\s+fail/);
  fix(root);
  const passing = rdapq(root, ['check']);
  assert.match(passing.out, /runtime\s+pass .*imports add/);
  assert.match(passing.out, /repo\s+pass/);
  const g = rdapq(root, ['gate']);
  assert.equal(g.code, 0, g.out);
  assert.match(g.out, /COMPLETE/);
});

test('unplanned files fail the repo oracle until the plan is amended with a reason', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  fix(root);
  fs.writeFileSync(path.join(root, 'notes.txt'), 'stray\n');
  rdapq(root, ['check']);
  const g = rdapq(root, ['gate']);
  assert.match(g.out, /CONTINUE/);
  assert.match(g.out, /unplanned: notes\.txt/);
  assert.equal(rdapq(root, ['plan', '--add', 'notes.txt']).code, 2);
  rdapq(root, ['plan', '--add', 'notes.txt', '--why', 'release note']);
  rdapq(root, ['check']);
  assert.match(rdapq(root, ['gate']).out, /COMPLETE/);
});

test('passing commands that never touch the change are only partial', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'README.md', '--run', 'node -e "process.exit(0)"']);
  fs.writeFileSync(path.join(root, 'README.md'), 'changed\n');
  const c = rdapq(root, ['check']);
  assert.match(c.out, /runtime\s+partial/);
  assert.match(rdapq(root, ['gate']).out, /runtime is partial/);
});

test('the same failure twice is STALLED', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  rdapq(root, ['check']);
  fs.writeFileSync(path.join(root, 'src', 'add.js'), "module.exports = (a, b) => a * b;\n");
  rdapq(root, ['check']);
  const g = rdapq(root, ['gate']);
  assert.equal(g.code, 1);
  assert.match(g.out, /STALLED/);
  assert.match(g.out, /same failure twice/);
});

test('HIGH risk needs a repro that failed before and passes after', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'HIGH', '--files', 'src/add.js', '--run', TEST_CMD, '--repro', TEST_CMD]);
  fix(root);
  rdapq(root, ['check']);
  assert.match(rdapq(root, ['gate']).out, /repro is partial/);

  const again = fixture();
  rdapq(again, ['start', '--risk', 'HIGH', '--files', 'src/add.js', '--run', TEST_CMD, '--repro', TEST_CMD]);
  assert.match(rdapq(again, ['check', '--before']).out, /failed as expected/);
  fix(again);
  rdapq(again, ['check']);
  assert.match(rdapq(again, ['gate']).out, /COMPLETE/);
});

test('HIGH risk without repro or --no-defect cannot complete', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'HIGH', '--files', 'src/add.js', '--run', TEST_CMD]);
  fix(root);
  rdapq(root, ['check']);
  assert.match(rdapq(root, ['gate']).out, /repro required/);
});

test('no required command is MISSING_TEST; a blocker note is BLOCKED', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js']);
  assert.match(rdapq(root, ['gate']).out, /MISSING_TEST/);
  const other = fixture();
  rdapq(other, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  rdapq(other, ['note', 'blocker', 'needs a production credential']);
  assert.match(rdapq(other, ['gate']).out, /BLOCKED/);
});

test('editing after a check forces another check', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  fix(root);
  rdapq(root, ['check']);
  fs.appendFileSync(path.join(root, 'src', 'add.js'), '// later edit\n');
  assert.match(rdapq(root, ['gate']).out, /changed since the last check/);
});

test('an unverified external claim on the changed path fails external', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'CRITICAL', '--files', 'src/add.js', '--run', TEST_CMD, '--no-defect']);
  rdapq(root, ['claim', 'the API returns cents', '--external']);
  fix(root);
  rdapq(root, ['check']);
  assert.match(rdapq(root, ['gate']).out, /external is fail/);
  rdapq(root, ['claim', 'the API returns cents', '--external', '--verified', '--source', 'docs/api.md']);
});

test('state.jsonl is append-only and oracles.json holds the plan', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  rdapq(root, ['check']);
  rdapq(root, ['note', 'decision', 'keep the signature']);
  const log = fs.readFileSync(path.join(root, '.rdapq', 'state.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.deepEqual(log.map((e) => e.kind), ['start', 'check', 'note']);
  const spec = JSON.parse(fs.readFileSync(path.join(root, '.rdapq', 'oracles.json'), 'utf8'));
  assert.deepEqual(spec.files, ['src/add.js']);
});

test('memory: add, search, dedupe, secrets, stale, caps', () => {
  const root = fixture();
  const add = (fact, extra = []) => rdapq(root, ['memory', 'add', '--class', 'OBSERVED', '--fact', fact, '--evidence', 'test/add.test.js', ...extra]);
  const first = add('node --test needs a glob on Node 24');
  assert.equal(first.code, 0, first.err);
  const id = /M-\d{8}-[0-9a-f]{4}/.exec(first.out)[0];
  assert.equal(add('Node --test  needs a glob on node 24').code, 2);
  assert.match(add('token=abcdef123456 works').err, /secret/);
  assert.match(add('x'.repeat(241)).err, /cap is 240/);
  assert.match(rdapq(root, ['memory', 'search', 'glob']).out, new RegExp(id));
  rdapq(root, ['memory', 'stale', id]);
  assert.match(rdapq(root, ['memory', 'search', 'glob']).out, /no matching/);
  for (let i = 0; i < 40; i += 1) assert.equal(add(`fact number ${i}`).code, 0);
  assert.match(add('one too many').err, /MEMORY_CAP/);
});

test('export writes anonymized measurement rows only', () => {
  const root = fixture();
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  rdapq(root, ['note', 'decision', 'secretive internal detail']);
  fix(root);
  rdapq(root, ['check']);
  rdapq(root, ['gate']);
  const outFile = path.join(root, 'export.jsonl');
  rdapq(root, ['export', '--out', outFile]);
  const text = fs.readFileSync(outFile, 'utf8');
  const row = JSON.parse(text);
  assert.equal(row.verdict, 'COMPLETE');
  assert.equal(row.rounds, 1);
  assert.doesNotMatch(text, /src\/add\.js|secretive|node --test/);
});

test('hook-stop blocks only while the gate says CONTINUE', () => {
  const root = fixture();
  const hook = (input) => spawnSync(process.execPath, [TOOL, 'hook-stop'], { cwd: root, input: JSON.stringify(input), encoding: 'utf8' });
  assert.equal(hook({ cwd: root }).stdout, '');
  rdapq(root, ['start', '--risk', 'LOW', '--files', 'src/add.js', '--run', TEST_CMD]);
  const blocked = JSON.parse(hook({ cwd: root }).stdout);
  assert.equal(blocked.decision, 'block');
  assert.match(blocked.reason, /CONTINUE/);
  assert.equal(hook({ cwd: root, stop_hook_active: true }).stdout, '');
  fix(root);
  rdapq(root, ['check']);
  assert.equal(hook({ cwd: root }).stdout, '');
});
