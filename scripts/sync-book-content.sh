#!/usr/bin/env bash
# Sync the kaikai-book markdown (ES + EN) into src/content/book/ so Astro
# can render each chapter as an HTML page. Companion to sync-book-pdfs.sh.
#
# The book lives in its own repo and stays the single source of truth. The
# site keeps a synced snapshot (gitignored) that is regenerated before every
# build; the `prebuild` npm hook runs this so `npm run build` picks it up.
#
# The content is read from a git ref with `git archive`, so it reflects a
# committed tree (no stray uncommitted edits) and never depends on the state
# of the working tree. By default it follows the checkout's current HEAD —
# check out the ref you want to publish (a tag, main, a branch) and sync.
#
# Nothing here assumes a fixed machine layout: KAIKAI_BOOK_DIR wins if set,
# then the conventional sibling checkout (../kaikai-book), then a bounded
# search under $HOME for whatever the user actually cloned it into. If none
# of that turns up a real kaikai-book checkout, this WARNS and exits 0 —
# the site build carries on without book chapters rather than failing.
#
#   KAIKAI_BOOK_DIR   path to the kaikai-book repo (default: search for it)
#   KAIKAI_BOOK_REF   git ref to sync: tag/branch/sha (default: HEAD, i.e.
#                     whatever the checkout points at), or WORKTREE to read
#                     the working tree as-is (uncommitted edits included)
set -euo pipefail

cd "$(dirname "$0")/.."
SITE_DIR="$(pwd)"

# Looks for a real kaikai-book checkout (has capitulos/ or chapters/) and
# prints its path on success. Tries, in order: an explicit KAIKAI_BOOK_DIR,
# the conventional sibling directory, then a bounded search under $HOME.
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
      if [ -d "$cand/capitulos" ] || [ -d "$cand/chapters" ]; then
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
  echo "warn: building without book chapters. Clone kaikailang-org/kaikai-book next to this repo, or set KAIKAI_BOOK_DIR, to include it." >&2
  exit 0
fi
BOOK_DIR="$(cd "$BOOK_DIR" && pwd)"
REF="${KAIKAI_BOOK_REF:-HEAD}"
echo "using kaikai-book at $BOOK_DIR" >&2

CONTENT_DIR="$SITE_DIR/src/content/book"
FIG_DIR="$SITE_DIR/public/book/figuras"

# --- 1. Resolve the source tree at the pinned ref -------------------------
# Export the ref into a temp dir with `git archive` so we never touch the
# checkout's current branch. WORKTREE reads the working tree directly (for
# previewing in-progress edits before they're tagged).
STAGE=""
# Runs as the EXIT trap, so its status becomes the script's: it must end in a
# success. Reading the working tree leaves STAGE empty and nothing to remove.
cleanup() {
  [ -n "$STAGE" ] && rm -rf "$STAGE"
  return 0
}
trap cleanup EXIT

if [ "$REF" = "WORKTREE" ]; then
  SRC="$BOOK_DIR"
  REF_LABEL="working tree"
else
  if ! git -C "$BOOK_DIR" cat-file -e "$REF^{commit}" 2>/dev/null; then
    echo "error: ref '$REF' not found in $BOOK_DIR" >&2
    echo "fetch it first (git -C $BOOK_DIR fetch --all --tags), or set" >&2
    echo "KAIKAI_BOOK_REF to a valid tag/branch/sha, or WORKTREE." >&2
    exit 1
  fi
  STAGE="$(mktemp -d)"
  git -C "$BOOK_DIR" archive "$REF" | tar -x -C "$STAGE"
  SRC="$STAGE"
  sha="$(git -C "$BOOK_DIR" rev-parse --short "$REF^{commit}")"
  if [ "$REF" = "HEAD" ]; then
    REF_LABEL="$(git -C "$BOOK_DIR" rev-parse --abbrev-ref HEAD) ($sha)"
  else
    REF_LABEL="$REF ($sha)"
  fi
fi

# --- 2. Clean previous snapshot (keep the .gitkeep placeholders) ----------
find "$CONTENT_DIR" -name '*.md' -delete 2>/dev/null || true
find "$FIG_DIR" -name '*.png' -delete 2>/dev/null || true
mkdir -p "$CONTENT_DIR/es" "$CONTENT_DIR/en" "$FIG_DIR"

# --- 3. Copy figures ------------------------------------------------------
# Chapters reference figures as `../figuras/<name>.png`; we rewrite that to
# `/book/figuras/<name>.png` below and expose the real PNGs from public/.
cp "$SRC"/figuras/*.png "$FIG_DIR/" 2>/dev/null || true

# --- 4. Transform one markdown file into a content entry ------------------
# Pulls the first `# ` heading out as the frontmatter title (the layout
# renders it), rewrites figure paths, and prepends title/lang/slug/order/part.
transform() {
  local src="$1" dest="$2"
  ORD="$3" PART="$4" BLANG="$5" SLUG="$6" perl -0777 -ne '
    my $body = $_;
    my $title = "";
    # First ATX h1 becomes the title; drop that line from the body.
    if ($body =~ s/^\#[ \t]+(.*?)[ \t]*\r?\n//m) { $title = $1; }
    $body =~ s{\.\./figuras/}{/book/figuras/}g;
    # YAML double-quoted scalar: escape backslash and double quote.
    $title =~ s/\\/\\\\/g;
    $title =~ s/"/\\"/g;
    print "---\n";
    print "title: \"$title\"\n";
    print "lang: $ENV{BLANG}\n";
    print "slug: $ENV{SLUG}\n";
    print "order: $ENV{ORD}\n";
    print "part: $ENV{PART}\n";
    print "---\n\n";
    print $body;
  ' "$src" > "$dest"
}

# Copy a glob of chapters/appendices into a language dir, numbering by the
# order they sort in. Appendices start at 100 so they always follow chapters.
sync_group() {
  local lang="$1" part="$2" start="$3"; shift 3
  local ord="$start" f slug
  for f in "$@"; do
    [ -e "$f" ] || continue
    slug="$(basename "$f" .md)"
    transform "$f" "$CONTENT_DIR/$lang/$slug.md" "$ord" "$part" "$lang" "$slug"
    ord=$((ord + 1))
  done
}

# --- 5. Sync both editions ------------------------------------------------
sync_group es chapter   0   "$SRC"/capitulos/cap*.md
sync_group es appendix  100 "$SRC"/apendices/ap*.md
sync_group en chapter   0   "$SRC"/chapters/ch*.md
sync_group en appendix  100 "$SRC"/appendices/ap*.md

# --- 6. Report ------------------------------------------------------------
es_count="$(find "$CONTENT_DIR/es" -name '*.md' | wc -l | tr -d ' ')"
en_count="$(find "$CONTENT_DIR/en" -name '*.md' | wc -l | tr -d ' ')"
fig_count="$(find "$FIG_DIR" -name '*.png' | wc -l | tr -d ' ')"
echo "book content synced from $BOOK_DIR @ $REF_LABEL"
echo "  es: $es_count chapters/appendices"
echo "  en: $en_count chapters/appendices"
echo "  figures: $fig_count"
