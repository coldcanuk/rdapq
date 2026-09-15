#!/usr/bin/env bash
# ==============================================================================
# RDAP-Q Multi-Harness Installer
# Supports: Codex, Grok, Copilot, Antigravity, Goose, Claude, Cline
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SKILL="$SCRIPT_DIR/rdap-q-skill"

# Default paths
RDAPQ_HOME="${RDAPQ_HOME:-$HOME/.rdapq}"
GEMINI_HOME="${GEMINI_HOME:-$HOME/.gemini}"
GOOSE_HOME="${GOOSE_HOME:-$HOME/.config/goose}"
CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
CLINE_HOME="${CLINE_HOME:-$HOME/.cline}"

print_banner() {
  cat <<'EOF'
  ____  ____    _    ____         ___  
 |  _ \|  _ \  / \  |  _ \       / _ \ 
 | |_) | | | |/ _ \ | |_) |_____| | | |
 |  _ <| |_| / ___ \|  __/|_____| |_| |
 |_| \_\____/_/   \_\_|          \__\_\
 
 Research-Driven Adaptive Planning with Quality Gates (v1.1.0)
 Universal AI Agent Protocol Installer
EOF
}

show_help() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  --all            Install for all supported AI harnesses
  --antigravity    Install for Google Antigravity
  --claude         Install for Anthropic Claude / Claude Code
  --cline          Install for Cline / Roo Code
  --copilot        Install for GitHub Copilot
  --codex          Install for OpenAI Codex
  --grok           Install for xAI Grok
  --goose          Install for Block Goose
  --repo [PATH]    Install RDAP-Q configs into a specific workspace/repo
  --global-only    Install only the core RDAP-Q global home (~/.rdapq)
  --help           Show this help message

Examples:
  ./install.sh --all
  ./install.sh --claude --copilot --cline
  ./install.sh --repo /path/to/my-project
EOF
}

install_core() {
  echo "==> Setting up RDAP-Q core at: $RDAPQ_HOME"
  mkdir -p "$RDAPQ_HOME/skills" "$RDAPQ_HOME/memory" "$RDAPQ_HOME/projects" "$RDAPQ_HOME/registry"
  rm -rf "$RDAPQ_HOME/skills/rdap-q"
  cp -R "$SOURCE_SKILL" "$RDAPQ_HOME/skills/rdap-q"
  echo "    ✓ Core skill installed to $RDAPQ_HOME/skills/rdap-q"
}

install_antigravity() {
  echo "==> Configuring for Google Antigravity..."
  local target_dir="$GEMINI_HOME/antigravity-cli/skills/rdap-q"
  mkdir -p "$(dirname "$target_dir")"
  rm -rf "$target_dir"
  cp -R "$SOURCE_SKILL" "$target_dir"
  echo "    ✓ Antigravity skill installed to $target_dir"
}

install_claude() {
  echo "==> Configuring for Anthropic Claude / Claude Code..."
  local cmd_dir="$CLAUDE_HOME/commands"
  mkdir -p "$cmd_dir"
  cp "$SCRIPT_DIR/.claude/commands/rdapq.md" "$cmd_dir/rdapq.md" 2>/dev/null || true
  echo "    ✓ Claude Code slash command installed (~/.claude/commands/rdapq.md)"
}

install_cline() {
  echo "==> Configuring for Cline / Roo Code..."
  mkdir -p "$CLINE_HOME"
  cp "$SCRIPT_DIR/.clinerules" "$CLINE_HOME/rdapq.rules.md" 2>/dev/null || true
  echo "    ✓ Cline global instructions copied to $CLINE_HOME/rdapq.rules.md"
}

install_copilot() {
  echo "==> Configuring for GitHub Copilot..."
  local copilot_dir="$HOME/.config/github-copilot"
  mkdir -p "$copilot_dir"
  cp "$SCRIPT_DIR/.github/copilot-instructions.md" "$copilot_dir/rdapq-instructions.md" 2>/dev/null || true
  echo "    ✓ Copilot instructions registered in $copilot_dir"
}

install_codex() {
  echo "==> Configuring for OpenAI Codex..."
  local codex_dir="$HOME/.codex"
  mkdir -p "$codex_dir"
  cp "$SCRIPT_DIR/AGENTS.md" "$codex_dir/AGENTS.md" 2>/dev/null || true
  echo "    ✓ Codex agent guidelines linked to $codex_dir/AGENTS.md"
}

install_grok() {
  echo "==> Configuring for xAI Grok..."
  local grok_dir="$HOME/.grok"
  mkdir -p "$grok_dir"
  cp "$SCRIPT_DIR/.grok/rules.md" "$grok_dir/rules.md" 2>/dev/null || true
  echo "    ✓ Grok rules registered in $grok_dir/rules.md"
}

install_goose() {
  echo "==> Configuring for Block Goose..."
  local toolkit_dir="$GOOSE_HOME/toolkits/rdap-q"
  mkdir -p "$toolkit_dir"
  cp -R "$SOURCE_SKILL"/* "$toolkit_dir/"
  echo "    ✓ Goose toolkit installed to $toolkit_dir"
}

install_repo() {
  local repo_path="$1"
  if [ ! -d "$repo_path" ]; then
    echo "Error: Target directory '$repo_path' does not exist."
    exit 1
  fi
  echo "==> Installing RDAP-Q workspace configuration into: $repo_path"
  mkdir -p "$repo_path/.rdapq/state" "$repo_path/.agents/skills" "$repo_path/.claude/commands" "$repo_path/.grok" "$repo_path/.github"
  
  cp "$SCRIPT_DIR/AGENTS.md" "$repo_path/AGENTS.md"
  cp "$SCRIPT_DIR/CLAUDE.md" "$repo_path/CLAUDE.md"
  cp "$SCRIPT_DIR/GEMINI.md" "$repo_path/GEMINI.md"
  cp "$SCRIPT_DIR/.clinerules" "$repo_path/.clinerules"
  cp "$SCRIPT_DIR/.goosehints" "$repo_path/.goosehints"
  cp "$SCRIPT_DIR/.grok/rules.md" "$repo_path/.grok/rules.md"
  cp "$SCRIPT_DIR/.github/copilot-instructions.md" "$repo_path/.github/copilot-instructions.md"
  cp "$SCRIPT_DIR/.claude/commands/rdapq.md" "$repo_path/.claude/commands/rdapq.md"
  
  rm -rf "$repo_path/.agents/skills/rdap-q"
  cp -R "$SOURCE_SKILL" "$repo_path/.agents/skills/rdap-q"
  
  echo "    ✓ Workspace enabled for Codex, Grok, Copilot, Antigravity, Goose, Claude, and Cline!"
}

# Main routing
if [ $# -eq 0 ]; then
  print_banner
  install_core
  install_antigravity
  install_claude
  install_cline
  install_copilot
  install_codex
  install_grok
  install_goose
  echo "==> RDAP-Q successfully installed across all available harnesses!"
  exit 0
fi

DO_CORE=1
DO_ALL=0
DO_ANTIGRAVITY=0
DO_CLAUDE=0
DO_CLINE=0
DO_COPILOT=0
DO_CODEX=0
DO_GROK=0
DO_GOOSE=0
TARGET_REPO=""

while [ $# -gt 0 ]; do
  case "$1" in
    --all)
      DO_ALL=1
      shift
      ;;
    --antigravity)
      DO_ANTIGRAVITY=1
      shift
      ;;
    --claude)
      DO_CLAUDE=1
      shift
      ;;
    --cline)
      DO_CLINE=1
      shift
      ;;
    --copilot)
      DO_COPILOT=1
      shift
      ;;
    --codex)
      DO_CODEX=1
      shift
      ;;
    --grok)
      DO_GROK=1
      shift
      ;;
    --goose)
      DO_GOOSE=1
      shift
      ;;
    --global-only)
      DO_CORE=1
      shift
      ;;
    --repo)
      TARGET_REPO="${2:-}"
      if [ -z "$TARGET_REPO" ]; then
        echo "Error: --repo requires a directory path."
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      print_banner
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

print_banner

if [ -n "$TARGET_REPO" ]; then
  install_repo "$TARGET_REPO"
  exit 0
fi

if [ "$DO_CORE" -eq 1 ]; then
  install_core
fi

if [ "$DO_ALL" -eq 1 ]; then
  install_antigravity
  install_claude
  install_cline
  install_copilot
  install_codex
  install_grok
  install_goose
else
  [ "$DO_ANTIGRAVITY" -eq 1 ] && install_antigravity
  [ "$DO_CLAUDE" -eq 1 ] && install_claude
  [ "$DO_CLINE" -eq 1 ] && install_cline
  [ "$DO_COPILOT" -eq 1 ] && install_copilot
  [ "$DO_CODEX" -eq 1 ] && install_codex
  [ "$DO_GROK" -eq 1 ] && install_grok
  [ "$DO_GOOSE" -eq 1 ] && install_goose
fi

echo "==> Installation complete! Run '/rdapq <task>' in your AI harness."
