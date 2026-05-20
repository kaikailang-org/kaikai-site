#!/usr/bin/env bash
# Sync the kaikai-book PDFs (ES + EN) into public/ before `astro build`.
#
# Two modes:
#   1. Release (preferred): KAIKAI_BOOK_RELEASE=v0.3-draft ./scripts/sync-book-pdfs.sh
#      Downloads the release assets from kaikailang-org/kaikai-book via gh.
#   2. Local build (default): builds from a local checkout at $KAIKAI_BOOK_DIR
#      (or ../kaikai-book if unset).
set -euo pipefail

cd "$(dirname "$0")/.."
SITE_DIR="$(pwd)"
REPO="${KAIKAI_BOOK_REPO:-kaikailang-org/kaikai-book}"

if [ -n "${KAIKAI_BOOK_RELEASE:-}" ]; then
  command -v gh >/dev/null || { echo "error: gh CLI required for release mode" >&2; exit 1; }
  echo "downloading PDFs from $REPO release $KAIKAI_BOOK_RELEASE"
  gh release download "$KAIKAI_BOOK_RELEASE" --repo "$REPO" \
    --pattern "kaikai-libro-es-*.pdf" \
    --output "$SITE_DIR/public/kaikai-libro-es.pdf" --clobber
  gh release download "$KAIKAI_BOOK_RELEASE" --repo "$REPO" \
    --pattern "kaikai-book-en-*.pdf" \
    --output "$SITE_DIR/public/kaikai-book-en.pdf" --clobber
else
  BOOK_DIR="${KAIKAI_BOOK_DIR:-../kaikai-book}"
  if [ ! -d "$BOOK_DIR" ]; then
    echo "error: kaikai-book not found at $BOOK_DIR" >&2
    echo "set KAIKAI_BOOK_DIR to override, or KAIKAI_BOOK_RELEASE=<tag> to fetch from a release" >&2
    exit 1
  fi
  cd "$BOOK_DIR/borradores/build-pdf"
  bash build.sh
  bash build-en.sh
  cp kaikai-libro-es.pdf kaikai-book-en.pdf "$SITE_DIR/public/"
fi

cd "$SITE_DIR"
ls -lh public/kaikai-libro-es.pdf public/kaikai-book-en.pdf
echo "PDFs ready in public/"
