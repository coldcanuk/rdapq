'use strict';

/**
 * Every file that carries the package version besides package.json.
 * check-versions.js verifies them; stamp-version.js rewrites them.
 */

// [file, path to the version inside the parsed JSON]
const JSON_TARGETS = [
  ['agentskills.json', ['version']],
  ['marketplace.json', ['version']],
  ['manifest.json', ['version']],
  ['rdap-q-skill/manifest.json', ['version']],
  ['plugin.json', ['version']],
  ['plugins/rdap-q/plugin.json', ['version']],
  ['.agents/plugins/rdap-q/plugin.json', ['version']],
  ['skills.json', ['skills', 0, 'version']],
  ['.grok/skill.json', ['version']],
  ['.codex/skill.json', ['version']],
  ['.claude-plugin/plugin.json', ['version']],
  ['.claude-plugin/marketplace.json', ['plugins', 0, 'version']],
  ['.grok-plugin/marketplace.json', ['plugins', 0, 'version']],
  ['.claude-plugin/plugin-index.json', ['plugins', 'rdap-q', 'version']],
  ['.grok-plugin/plugin-index.json', ['plugins', 'rdap-q', 'version']],
];

// Every semver in these files must be the package version.
const PROSE_TARGETS = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.clinerules',
  '.goosehints',
  '.grok/rules.md',
  '.claude/commands/rdapq.md',
  '.github/copilot-instructions.md',
  'rdap-q-skill/SKILL.md',
  'rdap-q-skill/README.md',
];

// These must not hardcode a version; they read package.json at runtime.
const NO_VERSION = ['bin/rdapq.js', 'lib/installer.js', 'install.sh', 'install.ps1'];

const SEMVER = /(?<![\d.])\d+\.\d+\.\d+(?![\d.])/g;

function pick(data, keys) {
  return keys.reduce((node, key) => (node == null ? undefined : node[key]), data);
}

module.exports = { JSON_TARGETS, PROSE_TARGETS, NO_VERSION, SEMVER, pick };
