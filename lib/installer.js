'use strict';

/**
 * RDAP-Q installer — single implementation used by the CLI and the
 * shell / PowerShell wrappers. Skill trees are staged and renamed into
 * place. Personal harness files are never replaced unless --force is set.
 */

const fs = require('fs');
const path = require('path');

const HARNESS_IDS = ['antigravity', 'claude', 'cline', 'copilot', 'codex', 'grok', 'goose'];
const COMMANDS = new Set(['install', 'init', 'status']);

function say(stream, message) {
  const text = String(message);
  stream(text.endsWith('\n') ? text : `${text}\n`);
}

function exists(target) {
  try {
    fs.lstatSync(target);
    return true;
  } catch (err) {
    if (err && err.code === 'ENOENT') return false;
    throw err;
  }
}

function readVersion(pkgRoot) {
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));
  if (!pkg.version || typeof pkg.version !== 'string') {
    throw new Error('package.json is missing a version');
  }
  return pkg.version;
}

function resolveLayout(env) {
  const home = env.HOME || env.USERPROFILE || require('os').homedir();
  const roaming = env.APPDATA || path.join(home, 'AppData', 'Roaming');
  return {
    rdapq: env.RDAPQ_HOME || path.join(home, '.rdapq'),
    gemini: env.GEMINI_HOME || path.join(home, '.gemini'),
    goose: env.GOOSE_HOME || path.join(home, '.config', 'goose'),
    claude: env.CLAUDE_HOME || path.join(home, '.claude'),
    cline: env.CLINE_HOME || path.join(home, '.cline'),
    codex: env.CODEX_HOME || path.join(home, '.codex'),
    grok: env.GROK_HOME || path.join(home, '.grok'),
    copilot: env.COPILOT_HOME || (process.platform === 'win32'
      ? path.join(roaming, 'github-copilot')
      : path.join(home, '.config', 'github-copilot')),
  };
}

function skillSource(pkgRoot) {
  const src = path.join(pkgRoot, 'rdap-q-skill');
  if (!exists(path.join(src, 'SKILL.md'))) {
    throw new Error(`RDAP-Q skill source is missing (${src}). Install from a full checkout or via npx rdap-q.`);
  }
  return src;
}

/**
 * Copy a file or directory. Symlinks are reproduced, never followed, and
 * rejected when they point outside `root`.
 */
function copyTreeSafe(src, dest, root) {
  const st = fs.lstatSync(src);
  if (st.isSymbolicLink()) {
    const link = fs.readlinkSync(src);
    const resolved = path.resolve(path.dirname(src), link);
    const rel = path.relative(root, resolved);
    if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error(`refusing outbound symlink ${src} -> ${link}`);
    }
    if (!exists(resolved)) {
      throw new Error(`refusing dangling symlink ${src} -> ${link}`);
    }
    fs.symlinkSync(link, dest);
    return;
  }
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyTreeSafe(path.join(src, name), path.join(dest, name), root);
    }
    return;
  }
  if (st.isFile()) {
    fs.copyFileSync(src, dest);
    return;
  }
  throw new Error(`unsupported filesystem entry: ${src}`);
}

/**
 * Publish `src` to `dest` by copying into a sibling staging directory and
 * renaming. The previous tree is removed only after the staged copy verifies.
 */
function publishTree(src, dest) {
  if (!exists(src)) {
    throw new Error(`source tree does not exist: ${src}`);
  }
  const parent = path.dirname(dest);
  fs.mkdirSync(parent, { recursive: true });
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const staging = path.join(parent, `.${path.basename(dest)}.staging-${token}`);
  const backup = path.join(parent, `.${path.basename(dest)}.backup-${token}`);
  fs.rmSync(staging, { recursive: true, force: true });
  let movedAside = false;
  try {
    copyTreeSafe(src, staging, src);
    if (!exists(path.join(staging, 'SKILL.md'))) {
      throw new Error(`staged copy is missing SKILL.md; left ${dest} untouched`);
    }
    if (exists(dest)) {
      fs.renameSync(dest, backup);
      movedAside = true;
    }
    fs.renameSync(staging, dest);
    if (movedAside) fs.rmSync(backup, { recursive: true, force: true });
  } catch (err) {
    if (exists(staging)) fs.rmSync(staging, { recursive: true, force: true });
    if (movedAside && !exists(dest) && exists(backup)) {
      fs.renameSync(backup, dest);
    }
    throw err;
  }
}

function assertRegularFile(target, label) {
  if (!exists(target)) return;
  const st = fs.lstatSync(target);
  if (st.isSymbolicLink()) {
    throw new Error(`refusing to follow symlink ${label || target}`);
  }
  if (!st.isFile()) {
    throw new Error(`refusing to replace non-file ${label || target}`);
  }
}

/**
 * Write a harness bridge. Existing different content is kept unless `force`.
 * A skipped write leaves the packaged bytes at `dest.rdapq`. A forced
 * replacement keeps the previous bytes at `dest.rdapq-backup`.
 */
function placeConfigFile(src, dest, { force }) {
  if (!exists(src)) {
    throw new Error(`missing packaged file: ${src}`);
  }
  assertRegularFile(src, src);
  const packaged = fs.readFileSync(src);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!exists(dest)) {
    fs.writeFileSync(dest, packaged);
    return { action: 'created', dest };
  }
  assertRegularFile(dest, dest);
  const current = fs.readFileSync(dest);
  if (current.equals(packaged)) {
    return { action: 'unchanged', dest };
  }
  if (!force) {
    const sidecar = `${dest}.rdapq`;
    assertRegularFile(sidecar, sidecar);
    fs.writeFileSync(sidecar, packaged);
    return { action: 'kept', dest, sidecar };
  }
  const backup = `${dest}.rdapq-backup`;
  assertRegularFile(backup, backup);
  fs.writeFileSync(backup, current);
  fs.writeFileSync(dest, packaged);
  return { action: 'replaced', dest, backup };
}

function describePlace(result) {
  if (result.action === 'created') return `    ✓ created ${result.dest}`;
  if (result.action === 'unchanged') return `    = unchanged ${result.dest}`;
  if (result.action === 'kept') {
    return `    ! kept existing ${result.dest} (pass --force to replace). Proposed copy: ${result.sidecar}`;
  }
  return `    ✓ replaced ${result.dest} (backup: ${result.backup})`;
}

function harnessFiles(id, layout, pkgRoot) {
  switch (id) {
    case 'claude':
      return [[path.join(pkgRoot, '.claude', 'commands', 'rdapq.md'), path.join(layout.claude, 'commands', 'rdapq.md')]];
    case 'cline':
      return [[path.join(pkgRoot, '.clinerules'), path.join(layout.cline, 'rdapq.rules.md')]];
    case 'copilot':
      return [[path.join(pkgRoot, '.github', 'copilot-instructions.md'), path.join(layout.copilot, 'rdapq-instructions.md')]];
    case 'codex':
      return [[path.join(pkgRoot, 'AGENTS.md'), path.join(layout.codex, 'AGENTS.md')]];
    case 'grok':
      return [[path.join(pkgRoot, '.grok', 'rules.md'), path.join(layout.grok, 'rules.md')]];
    default:
      return [];
  }
}

function harnessLabel(id) {
  return {
    antigravity: 'Google Antigravity',
    claude: 'Anthropic Claude / Claude Code',
    cline: 'Cline / Roo Code',
    copilot: 'GitHub Copilot',
    codex: 'OpenAI Codex',
    grok: 'xAI Grok',
    goose: 'Block Goose',
  }[id];
}

function harnessTreeDest(id, layout) {
  if (id === 'antigravity') return path.join(layout.gemini, 'antigravity-cli', 'skills', 'rdap-q');
  if (id === 'goose') return path.join(layout.goose, 'toolkits', 'rdap-q');
  return null;
}

const REPO_BRIDGES = [
  ['AGENTS.md', 'AGENTS.md'],
  ['CLAUDE.md', 'CLAUDE.md'],
  ['GEMINI.md', 'GEMINI.md'],
  ['.clinerules', '.clinerules'],
  ['.goosehints', '.goosehints'],
  [path.join('.grok', 'rules.md'), path.join('.grok', 'rules.md')],
  [path.join('.github', 'copilot-instructions.md'), path.join('.github', 'copilot-instructions.md')],
  [path.join('.claude', 'commands', 'rdapq.md'), path.join('.claude', 'commands', 'rdapq.md')],
];

function statusRows(layout) {
  return [
    ['Core Protocol ($RDAPQ_HOME)', path.join(layout.rdapq, 'skills', 'rdap-q', 'SKILL.md')],
    ['Google Antigravity', path.join(layout.gemini, 'antigravity-cli', 'skills', 'rdap-q', 'SKILL.md')],
    ['Anthropic Claude Code', path.join(layout.claude, 'commands', 'rdapq.md')],
    ['Cline / Roo Code', path.join(layout.cline, 'rdapq.rules.md')],
    ['GitHub Copilot', path.join(layout.copilot, 'rdapq-instructions.md')],
    ['OpenAI Codex', path.join(layout.codex, 'AGENTS.md')],
    ['xAI Grok', path.join(layout.grok, 'rules.md')],
    ['Block Goose', path.join(layout.goose, 'toolkits', 'rdap-q', 'SKILL.md')],
  ];
}

function parseArgs(argv) {
  const flags = {
    help: false,
    force: false,
    quiet: false,
    all: false,
    globalOnly: false,
    repo: null,
    command: null,
    harnesses: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--force') {
      flags.force = true;
    } else if (arg === '--quiet') {
      flags.quiet = true;
    } else if (arg === '--all') {
      flags.all = true;
    } else if (arg === '--global-only') {
      flags.globalOnly = true;
    } else if (arg === '--repo') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) throw new Error('--repo requires a directory path');
      i += 1;
      flags.repo = value;
    } else if (arg.startsWith('--') && HARNESS_IDS.includes(arg.slice(2))) {
      const id = arg.slice(2);
      if (!flags.harnesses.includes(id)) flags.harnesses.push(id);
    } else if (COMMANDS.has(arg)) {
      if (flags.command) throw new Error(`multiple commands: ${flags.command} and ${arg}`);
      flags.command = arg;
    } else {
      throw new Error(`unknown option: ${arg}`);
    }
  }
  return flags;
}

function helpText(version) {
  return `Usage: rdapq [COMMAND] [OPTIONS]
       npx rdap-q [COMMAND] [OPTIONS]

Research-Driven Adaptive Planning with Quality Gates (v${version})

Commands:
  install          Install the core skill and harness bridges (default)
  init             Write workspace bridges into the current repository
  status           Show install status across all 7 harnesses

Options:
  --all            Install every harness (default when none are named)
  --antigravity    Install for Google Antigravity
  --claude         Install for Anthropic Claude / Claude Code
  --cline          Install for Cline / Roo Code
  --copilot        Install for GitHub Copilot
  --codex          Install for OpenAI Codex
  --grok           Install for xAI Grok
  --goose          Install for Block Goose
  --repo PATH      Write workspace bridges into PATH
  --global-only    Install only ~/.rdapq (or $RDAPQ_HOME)
  --force          Replace existing harness files (keeps a .rdapq-backup)
  --quiet          Suppress the banner and per-file chatter
  --help, -h       Show this help message

Existing personal harness files are kept unless you pass --force.
A skipped file is also written beside the original as <file>.rdapq.
Skill directories are swapped into place only after the new tree is complete.

Examples:
  npx rdap-q install --claude
  npx rdap-q install --all
  npx rdap-q init
  npx rdap-q init --force
  npx rdap-q status
`;
}

function banner(version) {
  return `
  ____  ____    _    ____         ___
 |  _ \\|  _ \\  / \\  |  _ \\       / _ \\
 | |_) | | | |/ _ \\ | |_) |_____| | | |
 |  _ <| |_| / ___ \\|  __/|_____| |_| |
 |_| \\_\\____/_/   \\_\\_|          \\__\\_\\

 Research-Driven Adaptive Planning with Quality Gates (v${version})
 Universal AI Agent Protocol (Codex, Grok, Copilot, Antigravity, Goose, Claude, Cline)
`;
}

function installCore(pkgRoot, layout, log) {
  const src = skillSource(pkgRoot);
  log(`==> Setting up RDAP-Q core at: ${layout.rdapq}`);
  for (const sub of ['memory', 'projects', 'registry']) {
    fs.mkdirSync(path.join(layout.rdapq, sub), { recursive: true });
  }
  const dest = path.join(layout.rdapq, 'skills', 'rdap-q');
  publishTree(src, dest);
  log(`    ✓ Core skill installed to ${dest}`);
}

function installHarness(id, pkgRoot, layout, force, log) {
  log(`==> Configuring for ${harnessLabel(id)}...`);
  const treeDest = harnessTreeDest(id, layout);
  if (treeDest) {
    publishTree(skillSource(pkgRoot), treeDest);
    log(`    ✓ skill tree installed to ${treeDest}`);
  }
  for (const [fromRel, dest] of harnessFiles(id, layout, pkgRoot)) {
    const from = path.isAbsolute(fromRel) ? fromRel : path.join(pkgRoot, fromRel);
    log(describePlace(placeConfigFile(from, dest, { force })));
  }
}

function installRepo(pkgRoot, repoArg, cwd, force, log) {
  const abs = path.resolve(cwd, repoArg);
  if (!exists(abs) || !fs.statSync(abs).isDirectory()) {
    throw new Error(`directory does not exist: ${abs}`);
  }
  log(`==> Installing RDAP-Q workspace configuration into: ${abs}`);
  fs.mkdirSync(path.join(abs, '.rdapq', 'state'), { recursive: true });
  for (const [relSrc, relDest] of REPO_BRIDGES) {
    log(describePlace(placeConfigFile(path.join(pkgRoot, relSrc), path.join(abs, relDest), { force })));
  }
  const skillDest = path.join(abs, '.agents', 'skills', 'rdap-q');
  publishTree(skillSource(pkgRoot), skillDest);
  log(`    ✓ skill tree installed to ${skillDest}`);
  log('    ✓ Workspace bridges processed for Codex, Grok, Copilot, Antigravity, Goose, Claude, and Cline.');
}

function printStatus(layout, log) {
  log('==> Inspecting RDAP-Q Multi-Harness Status:');
  for (const [name, target] of statusRows(layout)) {
    const installed = exists(target) && fs.statSync(target).isFile();
    const icon = installed ? '✓' : '✗';
    const detail = installed ? `Installed (${target})` : 'Not installed';
    log(`  [${icon}] ${name.padEnd(28)}: ${detail}`);
  }
}

function selectedHarnesses(flags) {
  if (flags.globalOnly) return [];
  if (flags.all || flags.harnesses.length === 0) return HARNESS_IDS.slice();
  return flags.harnesses.slice();
}

function normalizeArgv(argv, invokedAs) {
  const args = argv.slice();
  const name = String(invokedAs || '').replace(/\.js$/, '');
  const known = new Set(['install', 'init', 'status', '--help', '-h']);
  if (name === 'rdapq-install' && !args.some((arg) => known.has(arg))) {
    args.unshift('install');
  }
  return args;
}

function runCli(argv, options = {}) {
  const pkgRoot = options.pkgRoot || path.resolve(__dirname, '..');
  const env = options.env || process.env;
  const cwd = options.cwd || process.cwd();
  const stdout = options.stdout || ((line) => process.stdout.write(line));
  const stderr = options.stderr || ((line) => process.stderr.write(line));
  const log = (message) => say(stdout, message);
  const error = (message) => say(stderr, message);
  const started = Date.now();

  try {
    const version = readVersion(pkgRoot);
    const flags = parseArgs(normalizeArgv(argv, options.invokedAs));
    if (flags.help) {
      if (!flags.quiet) log(banner(version).replace(/^\n/, ''));
      log(helpText(version).replace(/\n$/, ''));
      return 0;
    }
    if (!flags.quiet) log(banner(version).replace(/^\n/, ''));

    const repoMode = Boolean(flags.repo) || flags.command === 'init';
    const harnessMode = flags.all || flags.globalOnly || flags.harnesses.length > 0;
    if (repoMode && harnessMode) {
      throw new Error('init/--repo only writes workspace bridges. Run a separate install command for global harnesses.');
    }
    if (flags.globalOnly && (flags.all || flags.harnesses.length > 0)) {
      throw new Error('--global-only cannot be combined with harness selectors or --all');
    }
    if (flags.command === 'status' && (repoMode || harnessMode || flags.force)) {
      throw new Error('status does not take install selectors');
    }

    const layout = resolveLayout(env);

    if (flags.command === 'status') {
      printStatus(layout, log);
    } else if (repoMode) {
      installRepo(pkgRoot, flags.repo || cwd, cwd, flags.force, flags.quiet ? () => {} : log);
    } else {
      installCore(pkgRoot, layout, flags.quiet ? () => {} : log);
      for (const id of selectedHarnesses(flags)) {
        installHarness(id, pkgRoot, layout, flags.force, flags.quiet ? () => {} : log);
      }
      if (!flags.quiet) {
        log("\n==> Installation complete. Invoke '/rdapq <task>' in your AI harness.");
      }
    }

    if (!flags.quiet) log(`==> Done in ${Date.now() - started}ms`);
    return 0;
  } catch (err) {
    error(`error: ${err.message}`);
    return 1;
  }
}

module.exports = {
  HARNESS_IDS,
  REPO_BRIDGES,
  copyTreeSafe,
  harnessFiles,
  parseArgs,
  placeConfigFile,
  publishTree,
  readVersion,
  resolveLayout,
  runCli,
  statusRows,
};
