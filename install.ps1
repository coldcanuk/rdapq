# ==============================================================================
# RDAP-Q Multi-Harness Installer for Windows PowerShell
# Supports: Codex, Grok, Copilot, Antigravity, Goose, Claude, Cline
# ==============================================================================
param (
    [switch]$All,
    [switch]$Antigravity,
    [switch]$Claude,
    [switch]$Cline,
    [switch]$Copilot,
    [switch]$Codex,
    [switch]$Grok,
    [switch]$Goose,
    [switch]$GlobalOnly,
    [string]$Repo = "",
    [switch]$Help
)

$ErrorActionPreference = "Stop"

function Show-Banner {
    Write-Host @"
  ____  ____    _    ____         ___  
 |  _ \|  _ \  / \  |  _ \       / _ \ 
 | |_) | | | |/ _ \ | |_) |_____| | | |
 |  _ <| |_| / ___ \|  __/|_____| |_| |
 |_| \_\____/_/   \_\_|          \__\_\
 
 Research-Driven Adaptive Planning with Quality Gates (v1.1.0)
 Universal AI Agent Protocol Installer (Windows)
"@ -ForegroundColor Cyan
}

function Show-Help {
    Write-Host @"
Usage: .\install.ps1 [OPTIONS]

Options:
  -All            Install for all supported AI harnesses
  -Antigravity    Install for Google Antigravity
  -Claude         Install for Anthropic Claude / Claude Code
  -Cline          Install for Cline / Roo Code
  -Copilot        Install for GitHub Copilot
  -Codex          Install for OpenAI Codex
  -Grok           Install for xAI Grok
  -Goose          Install for Block Goose
  -Repo <Path>    Install RDAP-Q configs into a specific workspace/repo
  -GlobalOnly     Install only the core RDAP-Q global home (~/.rdapq)
  -Help           Show this help message
"@
}

if ($Help) {
    Show-Banner
    Show-Help
    exit 0
}

Show-Banner

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceSkill = Join-Path $ScriptDir "rdap-q-skill"

$RdapqHome = if ($env:RDAPQ_HOME) { $env:RDAPQ_HOME } else { Join-Path $env:USERPROFILE ".rdapq" }

function Install-Core {
    Write-Host "==> Setting up RDAP-Q core at: $RdapqHome" -ForegroundColor Green
    $SkillsDir = Join-Path $RdapqHome "skills"
    $TargetSkill = Join-Path $SkillsDir "rdap-q"
    
    New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $RdapqHome "memory") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $RdapqHome "projects") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $RdapqHome "registry") | Out-Null

    if (Test-Path $TargetSkill) { Remove-Item -Recurse -Force $TargetSkill }
    Copy-Item -Recurse -Force $SourceSkill $TargetSkill
    Write-Host "    Core skill installed to $TargetSkill" -ForegroundColor DarkGreen
}

function Install-Antigravity {
    Write-Host "==> Configuring for Google Antigravity..." -ForegroundColor Green
    $AgDir = Join-Path $env:USERPROFILE ".gemini\antigravity-cli\skills\rdap-q"
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $AgDir) | Out-Null
    if (Test-Path $AgDir) { Remove-Item -Recurse -Force $AgDir }
    Copy-Item -Recurse -Force $SourceSkill $AgDir
    Write-Host "    Antigravity skill installed to $AgDir" -ForegroundColor DarkGreen
}

function Install-Claude {
    Write-Host "==> Configuring for Anthropic Claude / Claude Code..." -ForegroundColor Green
    $CmdDir = Join-Path $env:USERPROFILE ".claude\commands"
    New-Item -ItemType Directory -Force -Path $CmdDir | Out-Null
    Copy-Item -Force (Join-Path $ScriptDir ".claude\commands\rdapq.md") (Join-Path $CmdDir "rdapq.md")
    Write-Host "    Claude Code command installed." -ForegroundColor DarkGreen
}

function Install-Cline {
    Write-Host "==> Configuring for Cline / Roo Code..." -ForegroundColor Green
    $ClineDir = Join-Path $env:USERPROFILE ".cline"
    New-Item -ItemType Directory -Force -Path $ClineDir | Out-Null
    Copy-Item -Force (Join-Path $ScriptDir ".clinerules") (Join-Path $ClineDir "rdapq.rules.md")
    Write-Host "    Cline instructions installed." -ForegroundColor DarkGreen
}

function Install-Copilot {
    Write-Host "==> Configuring for GitHub Copilot..." -ForegroundColor Green
    $CopilotDir = Join-Path $env:APPDATA "github-copilot"
    New-Item -ItemType Directory -Force -Path $CopilotDir | Out-Null
    Copy-Item -Force (Join-Path $ScriptDir ".github\copilot-instructions.md") (Join-Path $CopilotDir "rdapq-instructions.md")
    Write-Host "    Copilot instructions registered." -ForegroundColor DarkGreen
}

function Install-Codex {
    Write-Host "==> Configuring for OpenAI Codex..." -ForegroundColor Green
    $CodexDir = Join-Path $env:USERPROFILE ".codex"
    New-Item -ItemType Directory -Force -Path $CodexDir | Out-Null
    Copy-Item -Force (Join-Path $ScriptDir "AGENTS.md") (Join-Path $CodexDir "AGENTS.md")
    Write-Host "    Codex guidelines installed." -ForegroundColor DarkGreen
}

function Install-Grok {
    Write-Host "==> Configuring for xAI Grok..." -ForegroundColor Green
    $GrokDir = Join-Path $env:USERPROFILE ".grok"
    New-Item -ItemType Directory -Force -Path $GrokDir | Out-Null
    Copy-Item -Force (Join-Path $ScriptDir ".grok\rules.md") (Join-Path $GrokDir "rules.md")
    Write-Host "    Grok rules registered." -ForegroundColor DarkGreen
}

function Install-Goose {
    Write-Host "==> Configuring for Block Goose..." -ForegroundColor Green
    $GooseDir = Join-Path $env:USERPROFILE ".config\goose\toolkits\rdap-q"
    New-Item -ItemType Directory -Force -Path $GooseDir | Out-Null
    Copy-Item -Recurse -Force (Join-Path $SourceSkill "*") $GooseDir
    Write-Host "    Goose toolkit installed." -ForegroundColor DarkGreen
}

function Install-RepoWorkspace {
    param([string]$Path)
    Write-Host "==> Installing RDAP-Q configs into workspace: $Path" -ForegroundColor Green
    if (-not (Test-Path $Path)) {
        throw "Directory $Path does not exist."
    }
    New-Item -ItemType Directory -Force -Path (Join-Path $Path ".rdapq\state") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $Path ".agents\skills") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $Path ".claude\commands") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $Path ".grok") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $Path ".github") | Out-Null

    Copy-Item -Force (Join-Path $ScriptDir "AGENTS.md") (Join-Path $Path "AGENTS.md")
    Copy-Item -Force (Join-Path $ScriptDir "CLAUDE.md") (Join-Path $Path "CLAUDE.md")
    Copy-Item -Force (Join-Path $ScriptDir "GEMINI.md") (Join-Path $Path "GEMINI.md")
    Copy-Item -Force (Join-Path $ScriptDir ".clinerules") (Join-Path $Path ".clinerules")
    Copy-Item -Force (Join-Path $ScriptDir ".goosehints") (Join-Path $Path ".goosehints")
    Copy-Item -Force (Join-Path $ScriptDir ".grok\rules.md") (Join-Path $Path ".grok\rules.md")
    Copy-Item -Force (Join-Path $ScriptDir ".github\copilot-instructions.md") (Join-Path $Path ".github\copilot-instructions.md")
    Copy-Item -Force (Join-Path $ScriptDir ".claude\commands\rdapq.md") (Join-Path $Path ".claude\commands\rdapq.md")

    $TargetSkill = Join-Path $Path ".agents\skills\rdap-q"
    if (Test-Path $TargetSkill) { Remove-Item -Recurse -Force $TargetSkill }
    Copy-Item -Recurse -Force $SourceSkill $TargetSkill

    Write-Host "    Workspace enabled for all 7 AI harnesses!" -ForegroundColor DarkGreen
}

if ($Repo -ne "") {
    Install-RepoWorkspace -Path $Repo
    exit 0
}

# If no flags passed or -All passed, install for everything
if (-not ($Antigravity -or $Claude -or $Cline -or $Copilot -or $Codex -or $Grok -or $Goose -or $GlobalOnly)) {
    $All = $true
}

Install-Core

if ($All) {
    Install-Antigravity
    Install-Claude
    Install-Cline
    Install-Copilot
    Install-Codex
    Install-Grok
    Install-Goose
} else {
    if ($Antigravity) { Install-Antigravity }
    if ($Claude) { Install-Claude }
    if ($Cline) { Install-Cline }
    if ($Copilot) { Install-Copilot }
    if ($Codex) { Install-Codex }
    if ($Grok) { Install-Grok }
    if ($Goose) { Install-Goose }
}

Write-Host "==> Installation complete! Run '/rdapq <task>' in your AI harness." -ForegroundColor Cyan
