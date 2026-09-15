#!/usr/bin/env node

/**
 * RDAP-Q: Research-Driven Adaptive Planning with Quality Gates
 * Universal Multi-Harness Installer & CLI
 * Supports: Codex, Grok, Copilot, Antigravity, Goose, Claude, Cline
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const PKG_ROOT = path.resolve(__dirname, '..');
const SOURCE_SKILL = path.join(PKG_ROOT, 'rdap-q-skill');
const HOME = os.homedir();

// Default config destinations
const RDAPQ_HOME = process.env.RDAPQ_HOME || path.join(HOME, '.rdapq');
const GEMINI_HOME = process.env.GEMINI_HOME || path.join(HOME, '.gemini');
const GOOSE_HOME = process.env.GOOSE_HOME || path.join(HOME, '.config', 'goose');
const CLAUDE_HOME = process.env.CLAUDE_HOME || path.join(HOME, '.claude');
const CLINE_HOME = process.env.CLINE_HOME || path.join(HOME, '.cline');
const CODEX_HOME = path.join(HOME, '.codex');
const GROK_HOME = path.join(HOME, '.grok');
const COPILOT_HOME = process.platform === 'win32'
  ? path.join(process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming'), 'github-copilot')
  : path.join(HOME, '.config', 'github-copilot');

function printBanner() {
  console.log(`
  ____  ____    _    ____         ___  
 |  _ \\|  _ \\  / \\  |  _ \\       / _ \\ 
 | |_) | | | |/ _ \\ | |_) |_____| | | |
 |  _ <| |_| / ___ \\|  __/|_____| |_| |
 |_| \\_\\____/_/   \\_\\_|          \\__\\_\\
 
 Research-Driven Adaptive Planning with Quality Gates (v1.1.0)
 Universal AI Agent Protocol (Codex, Grok, Copilot, Antigravity, Goose, Claude, Cline)
`);
}

function showHelp() {
  console.log(`Usage: rdapq [COMMAND] [OPTIONS]
       npx rdapq [COMMAND] [OPTIONS]

Commands:
  install          Install RDAP-Q globally or for selected harnesses (default)
  init             Initialize RDAP-Q in the current repository / workspace
  status           Check RDAP-Q installation status across all 7 harnesses

Options:
  --all            Install for all supported AI harnesses (default for 'install')
  --antigravity    Install for Google Antigravity
  --claude         Install for Anthropic Claude / Claude Code
  --cline          Install for Cline / Roo Code
  --copilot        Install for GitHub Copilot
  --codex          Install for OpenAI Codex
  --grok           Install for xAI Grok
  --goose          Install for Block Goose
  --repo [PATH]    Install RDAP-Q configs into a specific workspace/repo
  --global-only    Install only the core RDAP-Q global home (~/.rdapq)
  --help, -h       Show this help message

Examples:
  npx rdapq
  npx rdapq init
  npx rdapq install --all
  npx rdapq --repo /path/to/my-project
  npx rdapq status
`);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFileSafe(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

function installCore() {
  console.log(`==> Setting up RDAP-Q core at: ${RDAPQ_HOME}`);
  const skillsDir = path.join(RDAPQ_HOME, 'skills', 'rdap-q');
  fs.mkdirSync(path.join(RDAPQ_HOME, 'memory'), { recursive: true });
  fs.mkdirSync(path.join(RDAPQ_HOME, 'projects'), { recursive: true });
  fs.mkdirSync(path.join(RDAPQ_HOME, 'registry'), { recursive: true });
  copyDirRecursive(SOURCE_SKILL, skillsDir);
  console.log(`    ✓ Core skill installed to ${skillsDir}`);
}

function installAntigravity() {
  console.log(`==> Configuring for Google Antigravity...`);
  const targetDir = path.join(GEMINI_HOME, 'antigravity-cli', 'skills', 'rdap-q');
  copyDirRecursive(SOURCE_SKILL, targetDir);
  console.log(`    ✓ Antigravity skill installed to ${targetDir}`);
}

function installClaude() {
  console.log(`==> Configuring for Anthropic Claude / Claude Code...`);
  const cmdDest = path.join(CLAUDE_HOME, 'commands', 'rdapq.md');
  copyFileSafe(path.join(PKG_ROOT, '.claude', 'commands', 'rdapq.md'), cmdDest);
  console.log(`    ✓ Claude Code slash command installed (~/.claude/commands/rdapq.md)`);
}

function installCline() {
  console.log(`==> Configuring for Cline / Roo Code...`);
  const rulesDest = path.join(CLINE_HOME, 'rdapq.rules.md');
  copyFileSafe(path.join(PKG_ROOT, '.clinerules'), rulesDest);
  console.log(`    ✓ Cline global instructions copied to ${rulesDest}`);
}

function installCopilot() {
  console.log(`==> Configuring for GitHub Copilot...`);
  const copilotDest = path.join(COPILOT_HOME, 'rdapq-instructions.md');
  copyFileSafe(path.join(PKG_ROOT, '.github', 'copilot-instructions.md'), copilotDest);
  console.log(`    ✓ Copilot instructions registered in ${copilotDest}`);
}

function installCodex() {
  console.log(`==> Configuring for OpenAI Codex...`);
  const codexDest = path.join(CODEX_HOME, 'AGENTS.md');
  copyFileSafe(path.join(PKG_ROOT, 'AGENTS.md'), codexDest);
  console.log(`    ✓ Codex agent guidelines linked to ${codexDest}`);
}

function installGrok() {
  console.log(`==> Configuring for xAI Grok...`);
  const grokDest = path.join(GROK_HOME, 'rules.md');
  copyFileSafe(path.join(PKG_ROOT, '.grok', 'rules.md'), grokDest);
  console.log(`    ✓ Grok rules registered in ${grokDest}`);
}

function installGoose() {
  console.log(`==> Configuring for Block Goose...`);
  const toolkitDir = path.join(GOOSE_HOME, 'toolkits', 'rdap-q');
  copyDirRecursive(SOURCE_SKILL, toolkitDir);
  console.log(`    ✓ Goose toolkit installed to ${toolkitDir}`);
}

function installRepo(targetRepo) {
  const absPath = path.resolve(targetRepo);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: Directory '${absPath}' does not exist.`);
    process.exit(1);
  }
  console.log(`==> Installing RDAP-Q workspace configuration into: ${absPath}`);

  // Create state directory
  fs.mkdirSync(path.join(absPath, '.rdapq', 'state'), { recursive: true });

  // Copy harness bridges
  copyFileSafe(path.join(PKG_ROOT, 'AGENTS.md'), path.join(absPath, 'AGENTS.md'));
  copyFileSafe(path.join(PKG_ROOT, 'CLAUDE.md'), path.join(absPath, 'CLAUDE.md'));
  copyFileSafe(path.join(PKG_ROOT, 'GEMINI.md'), path.join(absPath, 'GEMINI.md'));
  copyFileSafe(path.join(PKG_ROOT, '.clinerules'), path.join(absPath, '.clinerules'));
  copyFileSafe(path.join(PKG_ROOT, '.goosehints'), path.join(absPath, '.goosehints'));
  copyFileSafe(path.join(PKG_ROOT, '.grok', 'rules.md'), path.join(absPath, '.grok', 'rules.md'));
  copyFileSafe(path.join(PKG_ROOT, '.github', 'copilot-instructions.md'), path.join(absPath, '.github', 'copilot-instructions.md'));
  copyFileSafe(path.join(PKG_ROOT, '.claude', 'commands', 'rdapq.md'), path.join(absPath, '.claude', 'commands', 'rdapq.md'));

  // Install skill in .agents/skills/rdap-q
  const skillDest = path.join(absPath, '.agents', 'skills', 'rdap-q');
  copyDirRecursive(SOURCE_SKILL, skillDest);

  console.log(`    ✓ Workspace configured! Enabled for Codex, Grok, Copilot, Antigravity, Goose, Claude, and Cline.`);
}

function checkStatus() {
  console.log(`==> Inspecting RDAP-Q Multi-Harness Status:`);
  const checks = [
    { name: 'Core Protocol ($RDAPQ_HOME)', path: path.join(RDAPQ_HOME, 'skills', 'rdap-q', 'SKILL.md') },
    { name: 'Google Antigravity', path: path.join(GEMINI_HOME, 'antigravity-cli', 'skills', 'rdap-q', 'SKILL.md') },
    { name: 'Anthropic Claude Code', path: path.join(CLAUDE_HOME, 'commands', 'rdapq.md') },
    { name: 'Cline / Roo Code', path: path.join(CLINE_HOME, 'rdapq.rules.md') },
    { name: 'GitHub Copilot', path: path.join(COPILOT_HOME, 'rdapq-instructions.md') },
    { name: 'OpenAI Codex', path: path.join(CODEX_HOME, 'AGENTS.md') },
    { name: 'xAI Grok', path: path.join(GROK_HOME, 'rules.md') },
    { name: 'Block Goose', path: path.join(GOOSE_HOME, 'toolkits', 'rdap-q', 'SKILL.md') }
  ];

  for (const check of checks) {
    const installed = fs.existsSync(check.path);
    const icon = installed ? '✓' : '✗';
    const statusText = installed ? `Installed (${check.path})` : 'Not installed';
    console.log(`  [${icon}] ${check.name.padEnd(28)}: ${statusText}`);
  }
}

// CLI Arg Parsing
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printBanner();
  showHelp();
  process.exit(0);
}

printBanner();

if (args.includes('status')) {
  checkStatus();
  process.exit(0);
}

if (args.includes('init')) {
  installRepo(process.cwd());
  process.exit(0);
}

let targetRepo = null;
const repoIdx = args.indexOf('--repo');
if (repoIdx !== -1 && args[repoIdx + 1]) {
  targetRepo = args[repoIdx + 1];
}

if (targetRepo) {
  installRepo(targetRepo);
  process.exit(0);
}

const hasSpecificHarness = args.some(arg => [
  '--antigravity', '--claude', '--cline', '--copilot', '--codex', '--grok', '--goose', '--global-only'
].includes(arg));

installCore();

if (!hasSpecificHarness || args.includes('--all') || args.length === 0 || args[0] === 'install') {
  installAntigravity();
  installClaude();
  installCline();
  installCopilot();
  installCodex();
  installGrok();
  installGoose();
} else {
  if (args.includes('--antigravity')) installAntigravity();
  if (args.includes('--claude')) installClaude();
  if (args.includes('--cline')) installCline();
  if (args.includes('--copilot')) installCopilot();
  if (args.includes('--codex')) installCodex();
  if (args.includes('--grok')) installGrok();
  if (args.includes('--goose')) installGoose();
}

console.log(`\n==> Installation complete! Ready to run '/rdapq <task>' in your AI harness.`);
