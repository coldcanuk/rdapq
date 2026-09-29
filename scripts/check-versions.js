'use strict';

/**
 * package.json is the only version source. Every manifest and the prose
 * version stamps must match it. Banner text is rendered from package.json
 * at runtime and must not hardcode a version.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const version = pkg.version;
const semver = /(?<![\d.])\d+\.\d+\.\d+(?![\d.])/g;
const failures = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function checkJson(rel, pick) {
  const data = JSON.parse(read(rel));
  const found = pick(data);
  if (found !== version) {
    failures.push(`${rel}: expected ${version}, found ${found}`);
  }
}

function checkProse(rel) {
  const text = read(rel);
  const found = text.match(semver) || [];
  if (!found.includes(version)) {
    failures.push(`${rel}: does not mention ${version}`);
  }
  for (const hit of found) {
    if (hit !== version) failures.push(`${rel}: stray version ${hit}`);
  }
}

checkJson('agentskills.json', (j) => j.version);
checkJson('marketplace.json', (j) => j.version);
checkJson('manifest.json', (j) => j.version);
checkJson('rdap-q-skill/manifest.json', (j) => j.version);
checkJson('plugin.json', (j) => j.version);
checkJson('plugins/rdap-q/plugin.json', (j) => j.version);
checkJson('.agents/plugins/rdap-q/plugin.json', (j) => j.version);
checkJson('skills.json', (j) => j.skills[0].version);
checkJson('.grok/skill.json', (j) => j.version);
checkJson('.codex/skill.json', (j) => j.version);
checkJson('.claude-plugin/plugin.json', (j) => j.version);
checkJson('.claude-plugin/marketplace.json', (j) => j.plugins[0].version);
checkJson('.grok-plugin/marketplace.json', (j) => j.plugins[0].version);
checkJson('.claude-plugin/plugin-index.json', (j) => j.plugins['rdap-q'].version);
checkJson('.grok-plugin/plugin-index.json', (j) => j.plugins['rdap-q'].version);

for (const rel of [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.github/copilot-instructions.md',
  'rdap-q-skill/SKILL.md',
  'rdap-q-skill/README.md',
]) {
  checkProse(rel);
}

for (const rel of ['bin/rdapq.js', 'lib/installer.js', 'install.sh', 'install.ps1']) {
  const text = read(rel);
  const found = text.match(semver) || [];
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
