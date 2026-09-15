$ErrorActionPreference = "Stop"

$SourceDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

if ($env:RDAPQ_HOME) {
    $Target = $env:RDAPQ_HOME
} else {
    $Target = Join-Path $env:USERPROFILE ".rdapq"
}

$SkillsDir = Join-Path $Target "skills"
$SkillTarget = Join-Path $SkillsDir "rdap-q"

New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
if (Test-Path $SkillTarget) {
    Remove-Item -Recurse -Force $SkillTarget
}
Copy-Item -Recurse -Force $SourceDir $SkillTarget

New-Item -ItemType Directory -Force -Path (Join-Path $Target "memory") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Target "projects") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Target "registry") | Out-Null

Write-Output "Installed RDAP-Q to $SkillTarget"
