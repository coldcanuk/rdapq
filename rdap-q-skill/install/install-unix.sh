#!/usr/bin/env sh
set -eu

SOURCE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
TARGET="${RDAPQ_HOME:-${HOME}/.rdapq}"

mkdir -p "$TARGET/skills"
rm -rf "$TARGET/skills/rdap-q"
cp -R "$SOURCE_DIR" "$TARGET/skills/rdap-q"

mkdir -p "$TARGET/memory" "$TARGET/projects" "$TARGET/registry"

printf 'Installed RDAP-Q to %s\n' "$TARGET/skills/rdap-q"
