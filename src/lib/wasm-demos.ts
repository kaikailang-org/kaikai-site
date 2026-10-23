// Programs compiled to WebAssembly by scripts/build-wasm-demos.sh into
// public/wasm/<lang>/<id>/. `height` is what each page needs to show
// without scrolling.
export const wasmDemos = [
  { id: 'counter', height: 150 },
  { id: 'race', height: 220 },
  { id: 'life', height: 360 },
] as const;
