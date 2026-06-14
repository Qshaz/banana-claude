#!/usr/bin/env python3
"""
Tadabur Journal -- local journal management.
Stdlib only. No pip dependencies required.
"""

import argparse
import datetime
import json
import os
import re
import sys
import textwrap

JOURNAL_DIR = os.path.expanduser("~/.tadabur-journal")
COMMUNITY_DIR = os.path.join(JOURNAL_DIR, "community")


def ensure_dirs():
    os.makedirs(JOURNAL_DIR, exist_ok=True)
    os.makedirs(COMMUNITY_DIR, exist_ok=True)


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text[:40]


def unique_path(base_path):
    if not os.path.exists(base_path):
        return base_path
    base, ext = os.path.splitext(base_path)
    counter = 2
    while True:
        candidate = f"{base}-{counter}{ext}"
        if not os.path.exists(candidate):
            return candidate
        counter += 1


def read_frontmatter(filepath):
    """Parse YAML-like frontmatter from a journal entry file."""
    meta = {}
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if not content.startswith("---"):
            return meta, content
        end = content.find("\n---", 3)
        if end == -1:
            return meta, content
        frontmatter = content[3:end].strip()
        body = content[end + 4:].strip()
        for line in frontmatter.splitlines():
            if ":" in line:
                key, _, value = line.partition(":")
                meta[key.strip()] = value.strip()
        return meta, body
    except OSError:
        return meta, ""


def cmd_save(args):
    ensure_dirs()
    date_str = datetime.date.today().isoformat()
    category_slug = slugify(args.category)
    base_name = f"{date_str}_S{args.surah}-A{args.ayah}_{category_slug}.md"

    target_dir = COMMUNITY_DIR if args.visibility == "community" else JOURNAL_DIR
    filepath = unique_path(os.path.join(target_dir, base_name))
    entry_id = os.path.splitext(os.path.basename(filepath))[0]

    entry = textwrap.dedent(f"""\
        ---
        id: {entry_id}
        date: {date_str}
        surah: {args.surah}
        ayah: {args.ayah}
        category: {args.category}
        visibility: {args.visibility}
        ---

        {args.content}
    """)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(entry)

    _out({"status": "saved", "id": entry_id, "path": filepath, "visibility": args.visibility})


def cmd_list(args):
    ensure_dirs()
    entries = []

    if args.visibility == "community":
        dirs = [COMMUNITY_DIR]
    elif args.visibility == "all":
        dirs = [JOURNAL_DIR, COMMUNITY_DIR]
    else:
        dirs = [JOURNAL_DIR]

    for search_dir in dirs:
        if not os.path.isdir(search_dir):
            continue
        for fname in sorted(os.listdir(search_dir), reverse=True):
            if not fname.endswith(".md"):
                continue
            fpath = os.path.join(search_dir, fname)
            if os.path.isdir(fpath):
                continue
            meta, _ = read_frontmatter(fpath)
            if args.category and meta.get("category", "").lower() != args.category.lower():
                continue
            entries.append({
                "id": meta.get("id", fname.replace(".md", "")),
                "date": meta.get("date", ""),
                "surah": meta.get("surah", ""),
                "ayah": meta.get("ayah", ""),
                "category": meta.get("category", ""),
                "visibility": meta.get("visibility", "private"),
                "path": fpath,
            })

    if args.limit:
        entries = entries[: args.limit]

    _out({"entries": entries, "count": len(entries)})


def cmd_read(args):
    entry_id = args.id
    for search_dir in [JOURNAL_DIR, COMMUNITY_DIR]:
        if not os.path.isdir(search_dir):
            continue
        for fname in os.listdir(search_dir):
            candidate_id = fname.replace(".md", "")
            if candidate_id == entry_id or entry_id in candidate_id:
                fpath = os.path.join(search_dir, fname)
                meta, body = read_frontmatter(fpath)
                with open(fpath, "r", encoding="utf-8") as f:
                    raw = f.read()
                _out({"id": candidate_id, "meta": meta, "body": body, "raw": raw})
                return

    _err(f"Entry '{entry_id}' not found in journal or community directories.")


def cmd_export(args):
    ensure_dirs()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
    output_path = args.output or os.path.join(JOURNAL_DIR, f"export_{timestamp}.md")

    collected = []
    for search_dir in [JOURNAL_DIR, COMMUNITY_DIR]:
        if not os.path.isdir(search_dir):
            continue
        for fname in sorted(os.listdir(search_dir)):
            if not fname.endswith(".md") or fname.startswith("export_"):
                continue
            fpath = os.path.join(search_dir, fname)
            if os.path.isdir(fpath):
                continue
            with open(fpath, "r", encoding="utf-8") as f:
                collected.append(f.read())

    header = (
        f"# Tadabur Journal — Full Export\n"
        f"Exported: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        f"Total entries: {len(collected)}\n\n"
        f"---\n\n"
    )

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n\n---\n\n".join(collected))

    _out({"status": "exported", "path": output_path, "entries": len(collected)})


def cmd_delete(args):
    entry_id = args.id
    for search_dir in [JOURNAL_DIR, COMMUNITY_DIR]:
        if not os.path.isdir(search_dir):
            continue
        for fname in os.listdir(search_dir):
            if fname.replace(".md", "") == entry_id:
                fpath = os.path.join(search_dir, fname)
                os.remove(fpath)
                _out({"status": "deleted", "id": entry_id, "path": fpath})
                return

    _err(f"Entry '{entry_id}' not found.")


def _out(data):
    print(json.dumps(data, ensure_ascii=False, indent=2))


def _err(message):
    print(json.dumps({"error": message}, ensure_ascii=False), file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Tadabur Journal — local journal manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Commands:
              save      Save a new journal entry
              list      List journal entries
              read      Read a specific entry by ID
              export    Export all entries to a single markdown file
              delete    Delete an entry by ID
        """),
    )
    sub = parser.add_subparsers(dest="command", metavar="command")

    # save
    p_save = sub.add_parser("save", help="Save a new journal entry")
    p_save.add_argument("--surah", required=True, type=int, help="Surah number (1-114)")
    p_save.add_argument("--ayah", required=True, type=int, help="Ayah number")
    p_save.add_argument("--category", required=True, help="Life category (e.g. patience)")
    p_save.add_argument("--content", required=True, help="Journal entry content (markdown)")
    p_save.add_argument(
        "--visibility",
        choices=["private", "community"],
        default="private",
        help="private (default) or community",
    )

    # list
    p_list = sub.add_parser("list", help="List journal entries")
    p_list.add_argument(
        "--visibility",
        choices=["private", "community", "all"],
        default="private",
        help="Which entries to list",
    )
    p_list.add_argument("--limit", type=int, default=None, help="Maximum entries to return")
    p_list.add_argument("--category", default=None, help="Filter by category")

    # read
    p_read = sub.add_parser("read", help="Read a specific journal entry")
    p_read.add_argument("id", help="Entry ID (from list command)")

    # export
    p_export = sub.add_parser("export", help="Export all entries to a single markdown file")
    p_export.add_argument("--output", default=None, help="Output file path (optional)")

    # delete
    p_delete = sub.add_parser("delete", help="Delete a journal entry")
    p_delete.add_argument("id", help="Entry ID to delete")

    args = parser.parse_args()

    dispatch = {
        "save": cmd_save,
        "list": cmd_list,
        "read": cmd_read,
        "export": cmd_export,
        "delete": cmd_delete,
    }

    if args.command not in dispatch:
        parser.print_help()
        sys.exit(0)

    dispatch[args.command](args)


if __name__ == "__main__":
    main()
