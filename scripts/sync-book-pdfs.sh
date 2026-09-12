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
  # Same machine-agnostic lookup as sync-book-content.sh: explicit dir, then
  # the conventional sibling, then a bounded search under $HOME. If none of
  # that finds a real checkout, warn and skip instead of failing the build —
  # use KAIKAI_BOOK_RELEASE for a lookup that never depends on the local disk.
  find_book_dir() {
    if [ -n "${KAIKAI_BOOK_DIR:-}" ]; then
      if [ -d "$KAIKAI_BOOK_DIR" ]; then
        printf '%s\n' "$KAIKAI_BOOK_DIR"
        return 0
      fi
      echo "warn: KAIKAI_BOOK_DIR=$KAIKAI_BOOK_DIR does not exist, searching elsewhere" >&2
    fi

    if [ -d "../kaikai-book" ]; then
      printf '%s\n' "../kaikai-book"
      return 0
    fi

    if [ -n "${HOME:-}" ]; then
      local cand
      while IFS= read -r cand; do
        if [ -d "$cand/borradores/build-pdf" ]; then
          printf '%s\n' "$cand"
          return 0
        fi
      done < <(find "$HOME" -maxdepth 6 -type d -name kaikai-book \
                  -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null)
    fi

    return 1
  }

  if ! BOOK_DIR="$(find_book_dir)"; then
    echo "warn: kaikai-book checkout not found (checked \$KAIKAI_BOOK_DIR, ../kaikai-book, and a search under \$HOME)." >&2
    echo "warn: building without book PDFs. Clone kaikailang-org/kaikai-book next to this repo, set KAIKAI_BOOK_DIR, or set KAIKAI_BOOK_RELEASE=<tag> to fetch from a release." >&2
    exit 0
  fi
  echo "using kaikai-book at $BOOK_DIR" >&2
  cd "$BOOK_DIR/borradores/build-pdf"
  bash build.sh
  bash build-en.sh
  cp kaikai-libro-es.pdf kaikai-book-en.pdf "$SITE_DIR/public/"
fi

cd "$SITE_DIR"
ls -lh public/kaikai-libro-es.pdf public/kaikai-book-en.pdf
echo "PDFs ready in public/"
