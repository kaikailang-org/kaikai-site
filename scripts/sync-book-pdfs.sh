#!/usr/bin/env bash
# Build the kaikai-book PDFs (ES + EN) and copy them into public/.
# Run before `astro build` if the book has changed.
set -euo pipefail

cd "$(dirname "$0")/.."
SITE_DIR="$(pwd)"
BOOK_DIR="${KAIKAI_BOOK_DIR:-../kaikai-book}"

if [ ! -d "$BOOK_DIR" ]; then
  echo "error: kaikai-book not found at $BOOK_DIR" >&2
  echo "set KAIKAI_BOOK_DIR to override" >&2
  exit 1
fi

cd "$BOOK_DIR/borradores/build-pdf"
bash build.sh
bash build-en.sh

cp kaikai-libro-es.pdf kaikai-book-en.pdf "$SITE_DIR/public/"

cd "$SITE_DIR"
ls -lh public/kaikai-libro-es.pdf public/kaikai-book-en.pdf
echo "PDFs ready in public/"
