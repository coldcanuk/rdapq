'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const REPO = path.resolve(__dirname, '..');
const { copyTreeSafe, placeConfigFile, publishTree, runCli } = require('../lib/installer');

function tempLayout() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-'));
  const home = path.join(root, 'home');
  fs.mkdirSync(home, { recursive: true });
  const env = {
    ...process.env,
    HOME: home,
    USERPROFILE: home,
    RDAPQ_HOME: path.join(root, 'rdapq'),
    GEMINI_HOME: path.join(root, 'gemini'),
    GOOSE_HOME: path.join(root, 'goose'),
    CLAUDE_HOME: path.join(root, 'claude'),
    CLINE_HOME: path.join(root, 'cline'),
    CODEX_HOME: path.join(root, 'codex'),
    GROK_HOME: path.join(root, 'grok'),
    COPILOT_HOME: path.join(root, 'copilot'),
    CURSOR_HOME: path.join(root, 'cursor'),
  };
  return { root, home, env };
}

function run(args, env, extra = {}) {
  let out = '';
  let err = '';
  const code = runCli(args, {
    pkgRoot: REPO,
    env,
    cwd: extra.cwd,
    invokedAs: extra.invokedAs,
    stdout: (chunk) => { out += chunk; },
    stderr: (chunk) => { err += chunk; },
  });
  return { code, out, err };
}

test('bare install command still installs every harness', () => {
  const { env } = tempLayout();
  const result = run(['install'], env);
  assert.equal(result.code, 0, result.err);
  assert.equal(fs.existsSync(path.join(env.CODEX_HOME, 'AGENTS.md')), true);
  assert.equal(fs.existsSync(path.join(env.GROK_HOME, 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(env.CLAUDE_HOME, 'commands', 'rdapq.md')), true);
});

test('install --claude does not install the other harnesses', () => {
  const { env } = tempLayout();
  const result = run(['install', '--claude'], env);
  assert.equal(result.code, 0, result.err);
  assert.equal(fs.existsSync(path.join(env.RDAPQ_HOME, 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(env.CLAUDE_HOME, 'commands', 'rdapq.md')), true);
  assert.equal(fs.existsSync(path.join(env.CLAUDE_HOME, 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(env.CODEX_HOME, 'AGENTS.md')), false);
  assert.equal(fs.existsSync(path.join(env.GROK_HOME, 'skills', 'rdap-q', 'SKILL.md')), false);
  assert.equal(fs.existsSync(path.join(env.COPILOT_HOME, 'copilot-instructions.md')), false);
  assert.equal(fs.existsSync(path.join(env.CLINE_HOME, 'rules', 'rdapq.md')), false);
  assert.equal(fs.existsSync(path.join(env.GEMINI_HOME, 'antigravity-cli', 'skills', 'rdap-q', 'SKILL.md')), false);
  assert.equal(fs.existsSync(path.join(env.GOOSE_HOME, '.goosehints')), false);
  assert.equal(fs.existsSync(path.join(env.CURSOR_HOME, 'skills', 'rdap-q', 'SKILL.md')), false);
  const pkg = require('../package.json');
  assert.match(result.out, new RegExp(`v${pkg.version.replace(/\./g, '\\.')}`));
  assert.match(result.out, /Done in \d+ms/);
});

test('rdapq-install alias defaults to install and honors selectors', () => {
  const { env } = tempLayout();
  const result = run(['--grok'], env, { invokedAs: 'rdapq-install' });
  assert.equal(result.code, 0, result.err);
  assert.equal(fs.existsSync(path.join(env.GROK_HOME, 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(env.CODEX_HOME, 'AGENTS.md')), false);
});

test('install --all covers every harness and honors home overrides', () => {
  const { env, home } = tempLayout();
  const result = run(['install', '--all'], env);
  assert.equal(result.code, 0, result.err);
  const expected = [
    path.join(env.RDAPQ_HOME, 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.GEMINI_HOME, 'antigravity-cli', 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.GEMINI_HOME, 'config', 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.CLAUDE_HOME, 'commands', 'rdapq.md'),
    path.join(env.CLAUDE_HOME, 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.CLINE_HOME, 'rules', 'rdapq.md'),
    path.join(env.COPILOT_HOME, 'copilot-instructions.md'),
    path.join(env.COPILOT_HOME, 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.CODEX_HOME, 'AGENTS.md'),
    path.join(home, '.agents', 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.GROK_HOME, 'skills', 'rdap-q', 'SKILL.md'),
    path.join(env.GOOSE_HOME, '.goosehints'),
    path.join(env.CURSOR_HOME, 'skills', 'rdap-q', 'SKILL.md'),
  ];
  for (const file of expected) assert.equal(fs.existsSync(file), true, file);
  assert.equal(fs.existsSync(path.join(home, '.copilot')), false);
  assert.equal(fs.existsSync(path.join(home, '.codex')), false);
  assert.equal(fs.existsSync(path.join(home, '.cursor')), false);
});

test('install --cursor writes a Cursor skill and leaves other harnesses alone', () => {
  const { env, home } = tempLayout();
  const result = run(['install', '--cursor'], env);
  assert.equal(result.code, 0, result.err);
  const skill = path.join(env.CURSOR_HOME, 'skills', 'rdap-q', 'SKILL.md');
  const body = fs.readFileSync(skill, 'utf8');
  assert.match(body, /^---\nname: rdap-q\n/);
  assert.match(body, /disable-model-invocation: true/);
  assert.equal(fs.existsSync(path.join(env.CURSOR_HOME, 'skills', 'rdap-q', 'playbooks', '00-bootstrap.md')), true);
  assert.equal(fs.existsSync(path.join(env.CLAUDE_HOME, 'commands', 'rdapq.md')), false);
  assert.equal(fs.existsSync(path.join(home, '.cursor')), false);
});

test('reinstall replaces skill trees but keeps durable memory and drops stale files', () => {
  const { env } = tempLayout();
  assert.equal(run(['install', '--global-only'], env).code, 0);
  const skill = path.join(env.RDAPQ_HOME, 'skills', 'rdap-q');
  fs.writeFileSync(path.join(skill, 'STALE.md'), 'stale');
  fs.writeFileSync(path.join(env.RDAPQ_HOME, 'memory', 'lessons.md'), 'keep-me');
  const again = run(['install', '--global-only'], env);
  assert.equal(again.code, 0, again.err);
  assert.equal(fs.existsSync(path.join(skill, 'STALE.md')), false);
  assert.equal(fs.existsSync(path.join(skill, 'SKILL.md')), true);
  assert.equal(fs.readFileSync(path.join(env.RDAPQ_HOME, 'memory', 'lessons.md'), 'utf8'), 'keep-me');
});

test('init keeps a custom harness file unless --force, and never follows a symlink', () => {
  const { env, root } = tempLayout();
  const repo = path.join(root, 'repo');
  fs.mkdirSync(repo);
  fs.writeFileSync(path.join(repo, 'AGENTS.md'), 'custom rules\n');
  const first = run(['init'], env, { cwd: repo });
  assert.equal(first.code, 0, first.err);
  assert.equal(fs.readFileSync(path.join(repo, 'AGENTS.md'), 'utf8'), 'custom rules\n');
  assert.match(fs.readFileSync(path.join(repo, 'AGENTS.md.rdapq'), 'utf8'), /RDAP-Q/);
  assert.equal(fs.existsSync(path.join(repo, '.rdapq', 'state')), true);
  assert.equal(fs.existsSync(path.join(repo, '.agents', 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(repo, '.claude', 'skills', 'rdap-q', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(repo, '.clinerules', 'rdapq.md')), true);
  assert.equal(fs.existsSync(path.join(repo, 'CLAUDE.md')), true);

  const linked = path.join(repo, 'linked-target.md');
  fs.writeFileSync(linked, 'outside\n');
  fs.rmSync(path.join(repo, 'GEMINI.md'));
  fs.symlinkSync(linked, path.join(repo, 'GEMINI.md'));
  const forced = run(['init', '--force'], env, { cwd: repo });
  assert.equal(forced.code, 1);
  assert.match(forced.err, /refusing to follow symlink/);
  assert.equal(fs.readFileSync(linked, 'utf8'), 'outside\n');

  fs.unlinkSync(path.join(repo, 'GEMINI.md'));
  const replaced = run(['init', '--force'], env, { cwd: repo });
  assert.equal(replaced.code, 0, replaced.err);
  assert.match(fs.readFileSync(path.join(repo, 'AGENTS.md'), 'utf8'), /RDAP-Q/);
  assert.equal(fs.readFileSync(path.join(repo, 'AGENTS.md.rdapq-backup'), 'utf8'), 'custom rules\n');
});

test('identical bridges are left unchanged and status reports them', () => {
  const { env, root } = tempLayout();
  const repo = path.join(root, 'repo');
  fs.mkdirSync(repo);
  assert.equal(run(['--repo', repo], env).code, 0);
  const second = run(['--repo', repo], env);
  assert.equal(second.code, 0, second.err);
  assert.match(second.out, /unchanged/);
  assert.equal(fs.existsSync(path.join(repo, 'AGENTS.md.rdapq')), false);
  const status = run(['status'], env);
  assert.equal(status.code, 0, status.err);
  assert.match(status.out, /Core Protocol/);
  assert.match(status.out, /Not installed/);
});

test('--global-only cannot be combined with a harness selector', () => {
  const { env } = tempLayout();
  const result = run(['install', '--global-only', '--claude'], env);
  assert.equal(result.code, 1);
  assert.match(result.err, /--global-only/);
  assert.equal(fs.existsSync(env.RDAPQ_HOME), false);
});

test('unknown options fail before writing', () => {
  const { env } = tempLayout();
  const result = run(['install', '--not-a-flag'], env);
  assert.equal(result.code, 1);
  assert.match(result.err, /unknown option/);
  assert.equal(fs.existsSync(env.RDAPQ_HOME), false);
});

test('help does not install', () => {
  const { env } = tempLayout();
  const result = run(['--help'], env);
  assert.equal(result.code, 0, result.err);
  assert.match(result.out, /--force/);
  assert.equal(fs.existsSync(env.RDAPQ_HOME), false);
});

test('publishTree leaves the previous skill in place when staging is incomplete', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-tree-'));
  const dest = path.join(root, 'skills', 'rdap-q');
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'SKILL.md'), 'OLD');
  const src = path.join(root, 'src');
  fs.mkdirSync(src);
  fs.writeFileSync(path.join(src, 'README.md'), 'no skill marker');
  assert.throws(() => publishTree(src, dest), /SKILL\.md/);
  assert.equal(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8'), 'OLD');
  assert.equal(fs.readdirSync(path.join(root, 'skills')).includes('rdap-q'), true);
});

test('copyTreeSafe rejects outbound symlinks and preserves internal ones', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-link-'));
  const src = path.join(root, 'src');
  fs.mkdirSync(src);
  fs.writeFileSync(path.join(src, 'SKILL.md'), 'skill');
  fs.symlinkSync('./SKILL.md', path.join(src, 'alias.md'));
  fs.writeFileSync(path.join(root, 'secret.txt'), 'nope');
  fs.symlinkSync(path.join(root, 'secret.txt'), path.join(src, 'leak'));
  assert.throws(() => copyTreeSafe(src, path.join(root, 'bad'), src), /outbound symlink/);
  fs.unlinkSync(path.join(src, 'leak'));
  const dest = path.join(root, 'dest');
  copyTreeSafe(src, dest, src);
  assert.equal(fs.lstatSync(path.join(dest, 'alias.md')).isSymbolicLink(), true);
  assert.equal(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8'), 'skill');
});

test('placeConfigFile does not overwrite without force', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-cfg-'));
  const src = path.join(root, 'src.md');
  const dest = path.join(root, 'AGENTS.md');
  fs.writeFileSync(src, 'packaged\n');
  fs.writeFileSync(dest, 'mine\n');
  const kept = placeConfigFile(src, dest, { force: false });
  assert.equal(kept.action, 'kept');
  assert.equal(fs.readFileSync(dest, 'utf8'), 'mine\n');
  assert.equal(fs.readFileSync(`${dest}.rdapq`, 'utf8'), 'packaged\n');
  const replaced = placeConfigFile(src, dest, { force: true });
  assert.equal(replaced.action, 'replaced');
  assert.equal(fs.readFileSync(dest, 'utf8'), 'packaged\n');
  assert.equal(fs.readFileSync(`${dest}.rdapq-backup`, 'utf8'), 'mine\n');
});

test('install.sh refuses a pipe and delegates a real launch', () => {
  const { env } = tempLayout();
  const piped = spawnSync('bash', ['-s', '--', '--global-only'], {
    input: fs.readFileSync(path.join(REPO, 'install.sh')),
    encoding: 'utf8',
    env,
  });
  assert.notEqual(piped.status, 0);
  assert.match(`${piped.stderr}\n${piped.stdout}`, /refusing a piped install/);
  assert.equal(fs.existsSync(path.join(env.RDAPQ_HOME, 'skills', 'rdap-q')), false);

  const launched = spawnSync('bash', [path.join(REPO, 'install.sh'), '--claude'], {
    encoding: 'utf8',
    env,
  });
  assert.equal(launched.status, 0, launched.stderr);
  assert.equal(fs.existsSync(path.join(env.CLAUDE_HOME, 'commands', 'rdapq.md')), true);
  assert.equal(fs.existsSync(path.join(env.CODEX_HOME, 'AGENTS.md')), false);
});

test('skill-local installer swaps only after a verified stage', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rdapq-skill-'));
  const env = { ...process.env, HOME: root, RDAPQ_HOME: path.join(root, 'home') };
  const script = path.join(REPO, 'rdap-q-skill', 'install', 'install-unix.sh');
  const first = spawnSync('sh', [script], { encoding: 'utf8', env });
  assert.equal(first.status, 0, first.stderr);
  const dest = path.join(env.RDAPQ_HOME, 'skills', 'rdap-q');
  fs.writeFileSync(path.join(dest, 'STALE.md'), 'stale');
  const second = spawnSync('sh', [script], { encoding: 'utf8', env });
  assert.equal(second.status, 0, second.stderr);
  assert.equal(fs.existsSync(path.join(dest, 'STALE.md')), false);
  assert.equal(fs.existsSync(path.join(dest, 'SKILL.md')), true);
  assert.match(second.stdout, /Installed RDAP-Q/);
});
