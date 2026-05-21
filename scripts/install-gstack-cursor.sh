#!/usr/bin/env bash
# Install gstack skills for Cursor on Windows/macOS/Linux.
# gstack README advertises --host cursor, but setup.sh doesn't wire it yet (v1.42).
# This script mirrors the OpenCode install path using gen:skill-docs --host cursor.
set -euo pipefail

GSTACK_DIR="${GSTACK_DIR:-$HOME/.cursor/skills/gstack}"
CURSOR_SKILLS="$HOME/.cursor/skills"

if ! command -v bun >/dev/null 2>&1; then
  echo "Error: bun required. Run: npm install -g bun" >&2
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Error: node required on Windows for Playwright browse server." >&2
  exit 1
fi
if ! command -v git >/dev/null 2>&1; then
  echo "Error: git required." >&2
  exit 1
fi

if [ ! -d "$GSTACK_DIR/.git" ]; then
  echo "Cloning gstack to $GSTACK_DIR ..."
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR"
fi

cd "$GSTACK_DIR"
echo "Building gstack (browse + deps)..."
bun install
bun run build

echo "Generating Cursor skill docs..."
bun run gen:skill-docs --host cursor

GENERATED="$GSTACK_DIR/.cursor/skills"
if [ ! -d "$GENERATED" ]; then
  echo "Error: expected $GENERATED after gen:skill-docs" >&2
  exit 1
fi

mkdir -p "$CURSOR_SKILLS/gstack"
link_or_copy() {
  local src="$1" dst="$2"
  rm -rf "$dst"
  if [ -d "$src" ]; then cp -R "$src" "$dst"
  else cp -f "$src" "$dst"
  fi
}

# Runtime root (bin, browse, ETHOS) — skills reference ~/.cursor/skills/gstack
link_or_copy "$GSTACK_DIR/bin" "$CURSOR_SKILLS/gstack/bin"
link_or_copy "$GSTACK_DIR/browse/dist" "$CURSOR_SKILLS/gstack/browse/dist"
link_or_copy "$GSTACK_DIR/browse/bin" "$CURSOR_SKILLS/gstack/browse/bin"
[ -f "$GSTACK_DIR/ETHOS.md" ] && cp -f "$GSTACK_DIR/ETHOS.md" "$CURSOR_SKILLS/gstack/ETHOS.md"

# Individual skills (gstack-review, gstack-qa, …)
linked=()
for skill_dir in "$GENERATED"/gstack*/; do
  [ -f "$skill_dir/SKILL.md" ] || continue
  name="$(basename "$skill_dir")"
  [ "$name" = "gstack" ] && continue
  link_or_copy "$skill_dir" "$CURSOR_SKILLS/$name"
  linked+=("$name")
done

# Root gstack router skill
if [ -f "$GENERATED/gstack/SKILL.md" ]; then
  link_or_copy "$GENERATED/gstack/SKILL.md" "$CURSOR_SKILLS/gstack/SKILL.md"
fi

echo ""
echo "gstack ready for Cursor."
echo "  repo:    $GSTACK_DIR"
echo "  skills:  $CURSOR_SKILLS (${#linked[@]} skills)"
echo "  upgrade: cd \"$GSTACK_DIR\" && git pull && bash \"$0\""
echo ""
echo "On Windows: re-run this script after every 'git pull' (file copies, not symlinks)."
