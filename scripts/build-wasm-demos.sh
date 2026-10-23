#!/usr/bin/env bash
# Compile the browser demos in src/wasm/<lang>/*.kai into public/wasm/,
# where the /web page loads them in iframes. Run by the `prebuild` hook.
#
# Each demo becomes public/wasm/<lang>/<demo>/ with the module, its host
# and a page styled like the site. The output is gitignored, like the
# book: a module is rebuilt only when its source is newer, and the page
# around it every time.
#
# The modules `kai` writes as .mjs are renamed .js: the server has no MIME
# type for .mjs, and a browser refuses a module served without one.
#
# Needs a `kai` with the wasm32-browser target on PATH. Without one, the
# demos already built are kept; with none built, the build stops, since
# the page would load nothing.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC=src/wasm
OUT=public/wasm

if ! kai build --help 2>/dev/null | grep -q 'wasm32-browser'; then
  if [ -n "$(find "$OUT" -name '*.wasm' 2>/dev/null)" ]; then
    echo "warn: no kai with --target=wasm32-browser on PATH; keeping the demos in $OUT" >&2
    exit 0
  fi
  echo "error: building the /web demos needs kai with --target=wasm32-browser on PATH" >&2
  exit 1
fi

page() {
  local name=$1
  cat <<HTML
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$name</title>
<style>
  html, body { margin: 0; height: 100%; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.4rem; padding: 1rem; box-sizing: border-box;
    background: #0d1117; color: #e6edf3;
    font: 15px/1.4 "JetBrains Mono", "SF Mono", Consolas, monospace;
  }
  pre { margin: 0; font: inherit; min-height: 1.4em; }
  #kai-stdout:empty { display: none; }
  button {
    font-family: inherit; font-size: 1rem; font-weight: 600; line-height: 1;
    color: #1a1305; background: #ffd166;
    border: 0; border-radius: 6px; padding: 0.55rem 1.1rem; cursor: pointer;
  }
  button:hover { background: #ffdc85; }
  canvas { max-width: 100%; height: auto; cursor: pointer; border-radius: 4px; }
</style>
<pre id="kai-stdout"></pre>
<script type="module" src="$name.js"></script>
HTML
}

built=0
for src in "$SRC"/*/*.kai; do
  lang=$(basename "$(dirname "$src")")
  name=$(basename "$src" .kai)
  dir="$OUT/$lang/$name"
  if [ ! -f "$dir/$name.wasm" ] || [ "$src" -nt "$dir/$name.wasm" ]; then
    mkdir -p "$dir"
    kai build --target=wasm32-browser "$src" -o "$dir/$name"
    sed 's/kai_host\.mjs/kai_host.js/' "$dir/$name.mjs" > "$dir/$name.js"
    mv "$dir/kai_host.mjs" "$dir/kai_host.js"
    rm "$dir/$name.mjs"
    built=$((built + 1))
  fi
  page "$name" > "$dir/$name.html"
done
echo "wasm demos: $built rebuilt in $OUT"
