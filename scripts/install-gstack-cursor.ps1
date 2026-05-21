# Install gstack skills for Cursor (Windows).
# gstack's ./setup --host cursor is not wired in setup.sh yet — this script fills the gap.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/install-gstack-cursor.ps1

$ErrorActionPreference = "Stop"

$GstackRepo = Join-Path $env:USERPROFILE ".cursor\skills\gstack-repo"
$CursorSkills = Join-Path $env:USERPROFILE ".cursor\skills"
$RuntimeRoot = Join-Path $CursorSkills "gstack"

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "$name is required. For bun: npm install -g bun"
  }
}

Require-Command git
Require-Command bun
Require-Command node

if (-not (Test-Path (Join-Path $GstackRepo ".git"))) {
  Write-Host "Cloning gstack to $GstackRepo ..."
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git $GstackRepo
}

Set-Location $GstackRepo
Write-Host "Installing dependencies..."
bun install | Out-Null

Write-Host "Building browse binary (required for /qa and /browse)..."
New-Item -ItemType Directory -Force -Path "browse\dist" | Out-Null
bun build --compile browse/src/cli.ts --outfile browse/dist/browse.exe
bun build --compile browse/src/find-browse.ts --outfile browse/dist/find-browse.exe

Write-Host "Generating Cursor skill docs..."
bun run gen:skill-docs --host cursor

$Generated = Join-Path $GstackRepo ".cursor\skills"
if (-not (Test-Path $Generated)) { throw "gen:skill-docs did not create $Generated" }

# Runtime root — skills reference ~/.cursor/skills/gstack/{bin,browse,...}
New-Item -ItemType Directory -Force -Path $RuntimeRoot | Out-Null
foreach ($item in @(
  @{ Src = "browse\dist"; Dst = "browse\dist" },
  @{ Src = "browse\bin"; Dst = "browse\bin" },
  @{ Src = "bin"; Dst = "bin" },
  @{ Src = "ETHOS.md"; Dst = "ETHOS.md" }
)) {
  $src = Join-Path $GstackRepo $item.Src
  $dst = Join-Path $RuntimeRoot $item.Dst
  if (-not (Test-Path $src)) { continue }
  if ((Get-Item $src).PSIsContainer) {
    if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
    Copy-Item $src $dst -Recurse -Force
  } else {
    Copy-Item $src $dst -Force
  }
}

$rootSkill = Join-Path $Generated "gstack\SKILL.md"
if (Test-Path $rootSkill) { Copy-Item $rootSkill (Join-Path $RuntimeRoot "SKILL.md") -Force }

$count = 0
Get-ChildItem $Generated -Directory -Filter "gstack*" | ForEach-Object {
  if ($_.Name -eq "gstack") { return }
  $dst = Join-Path $CursorSkills $_.Name
  if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
  Copy-Item $_.FullName $dst -Recurse -Force
  $count++
}

Write-Host ""
Write-Host "gstack ready for Cursor."
Write-Host "  repo:    $GstackRepo"
Write-Host "  skills:  $count installed under $CursorSkills"
Write-Host "  upgrade: git -C `"$GstackRepo`" pull; re-run this script"
Write-Host ""
Write-Host "See docs/GSTACK.md for which skills to use and HDS boundaries."
