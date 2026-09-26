#!/usr/bin/env python3
"""Compare RDAP-Q install paths with current vendor documentation.

Stdlib only. A green run does not call a model. On drift it writes a review
prompt that a local model can read. Exit 0 when every claim still matches,
1 when a path disappeared from the installer, the README, or the vendor docs,
2 when a harness could not be checked because every fetch failed.
"""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_VENDORS = Path(__file__).resolve().parent / "vendors.json"
USER_AGENT = "rdapq-harness-audit/1"
MAX_BYTES = 1_500_000
TIMEOUT = 25
REDIRECTS = (301, 302, 303, 307, 308)


def fetch(url: str) -> tuple[str, str, str]:
    current = url
    last_error = "no response"
    for _ in range(6):
        req = urllib.request.Request(current, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ssl.create_default_context()) as response:
                final = response.geturl()
                body = response.read(MAX_BYTES + 1)
                if len(body) > MAX_BYTES:
                    body = body[:MAX_BYTES]
                return final, str(response.status), body.decode("utf-8", "replace")
        except urllib.error.HTTPError as error:
            location = error.headers.get("Location") if error.headers else None
            if error.code in REDIRECTS and location:
                current = urljoin(current, location)
                last_error = f"HTTP {error.code} -> {current}"
                continue
            return current, f"HTTP {error.code}", ""
        except Exception as error:  # noqa: BLE001 - report the network failure, do not crash the sweep
            last_error = f"{type(error).__name__}: {error}"
            break
    return current, last_error, ""


def load_cache(path: Path, max_age: int, refresh: bool) -> dict | None:
    if refresh or not path.exists():
        return None
    try:
        cached = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return None
    age = time.time() - float(cached.get("fetched_at", 0))
    if age > max_age:
        return None
    body_path = Path(cached.get("body", ""))
    if not body_path.is_file():
        return None
    cached["text"] = body_path.read_text(encoding="utf-8", errors="replace")
    return cached


def store_cache(path: Path, url: str, final: str, status: str, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    body = path.with_suffix(".body")
    body.write_text(text, encoding="utf-8")
    path.write_text(json.dumps({
        "url": url,
        "final": final,
        "status": status,
        "fetched_at": time.time(),
        "body": str(body),
    }))


def cached_fetch(url: str, cache_dir: Path, max_age: int, refresh: bool) -> dict:
    key = "".join(ch if ch.isalnum() else "_" for ch in url)[:180]
    slot = cache_dir / f"{key}.json"
    cached = load_cache(slot, max_age, refresh)
    if cached:
        cached["cache"] = "hit"
        return cached
    final, status, text = fetch(url)
    if text:
        store_cache(slot, url, final, status, text)
    return {"url": url, "final": final, "status": status, "text": text, "cache": "miss"}


def links_in(text: str) -> list[str]:
    found = []
    token = []
    for char in text:
        if char in " \t\r\n<>\"'()[]":
            if token and token[0].startswith("http"):
                found.append("".join(token).rstrip(".,"))
            token = []
            continue
        token.append(char)
    if token and token[0].startswith("http"):
        found.append("".join(token).rstrip(".,"))
    return found


def host_ok(url: str, index_host: str, allow: list[str]) -> bool:
    host = urlparse(url).hostname or ""
    allowed = {index_host, *allow}
    return host in allowed


def corpus_for(harness: dict, cache_dir: Path, max_age: int, refresh: bool) -> tuple[str, list[dict]]:
    pages = []
    seen = set()

    def add(url: str) -> None:
        if not url or url in seen:
            return
        seen.add(url)
        pages.append(cached_fetch(url, cache_dir, max_age, refresh))

    for url in harness.get("indexes", []):
        add(url)
    for url in harness.get("pins", []):
        add(url)

    index_text = ""
    index_host = ""
    for page in pages:
        if page["url"] in harness.get("indexes", []) and page.get("text"):
            index_text += "\n" + page["text"]
            index_host = urlparse(page.get("final") or page["url"]).hostname or ""
    allow = harness.get("allow_hosts", [])
    patterns = [item.lower() for item in harness.get("follow", [])]
    followed = 0
    limit = int(harness.get("follow_limit", 6))
    for link in links_in(index_text):
        if followed >= limit:
            break
        if not any(pattern in link.lower() for pattern in patterns):
            continue
        if index_host and not host_ok(link, index_host, allow):
            continue
        if link in seen:
            continue
        add(link)
        followed += 1

    usable = [page for page in pages if page.get("text")]
    return "\n".join(page["text"] for page in usable), pages


def evaluate(spec: dict, installer: str, readme: str, cache_dir: Path, max_age: int, refresh: bool) -> dict:
    results = []
    for harness in spec["harnesses"]:
        text, pages = corpus_for(harness, cache_dir, max_age, refresh)
        fetched = [page for page in pages if page.get("text")]
        for claim in harness["claims"]:
            results.append({
                "harness": harness["id"],
                "claim": claim["id"],
                "installer": claim["installer"] in installer,
                "docs": claim["docs"] in text,
                "readme": claim["readme"] in readme,
                "sources": len(fetched),
                "pages": [page.get("final") or page["url"] for page in fetched],
                "errors": [f"{page['url']} ({page['status']})" for page in pages if not page.get("text")],
            })
    forbidden = []
    for item in spec.get("forbidden_in_readme", []):
        lines = [line for line in readme.splitlines() if item in line]
        if any("do not" not in line.lower() for line in lines):
            forbidden.append(item)
    return {"results": results, "forbidden": forbidden}


def status_of(row: dict) -> str:
    if row["sources"] == 0:
        return "UNCHECKED"
    if row["installer"] and row["docs"] and row["readme"]:
        return "OK"
    return "DRIFT"


def render(report: dict) -> str:
    lines = [
        "# RDAP-Q harness audit",
        "",
        f"Checked: {report['checked_at']}",
        "",
        "| Harness | Claim | Installer | Docs | README | Status |",
        "|---|---|---|---|---|---|",
    ]
    for row in report["results"]:
        state = status_of(row)
        mark = lambda ok: "yes" if ok else "NO"
        lines.append(
            f"| {row['harness']} | {row['claim']} | {mark(row['installer'])} | "
            f"{mark(row['docs'])} | {mark(row['readme'])} | {state} |"
        )
    if report["forbidden"]:
        lines.extend(["", "## README still recommends a removed command", ""])
        lines.extend(f"- `{item}`" for item in report["forbidden"])
    problems = [row for row in report["results"] if status_of(row) != "OK"]
    if problems:
        lines.extend(["", "## What failed", ""])
        for row in problems:
            lines.append(f"### {row['harness']} / {row['claim']}")
            lines.append("")
            lines.append(f"- sources fetched: {row['sources']}")
            if row["errors"]:
                lines.append("- fetch errors: " + "; ".join(row["errors"]))
            if row["pages"]:
                lines.append("- pages: " + ", ".join(row["pages"]))
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def review_prompt(report: dict) -> str:
    failed = [row for row in report["results"] if status_of(row) != "OK"]
    lines = [
        "The RDAP-Q harness audit found drift. Do not change install paths unless the fetched vendor page contradicts lib/installer.js.",
        "Read the cached page bodies listed below and say which claim is stale.",
        "",
    ]
    for row in failed:
        lines.append(f"- {row['harness']} {row['claim']}: installer={row['installer']} docs={row['docs']} readme={row['readme']}")
        lines.extend(f"  page: {page}" for page in row["pages"])
        lines.extend(f"  error: {error}" for error in row["errors"])
    if report["forbidden"]:
        lines.append("README contains removed commands: " + ", ".join(report["forbidden"]))
    lines.append("")
    lines.append("Reply with the file and path that should change, or say the vendor page was unreachable.")
    return "\n".join(lines) + "\n"


def exit_code(report: dict) -> int:
    rows = report["results"]
    if report["forbidden"] or any(status_of(row) == "DRIFT" for row in rows):
        return 1
    if any(status_of(row) == "UNCHECKED" for row in rows):
        return 2
    return 0


def self_test() -> int:
    spec = {
        "forbidden_in_readme": ["goose toolkit add"],
        "harnesses": [{
            "id": "demo",
            "indexes": [],
            "pins": [],
            "follow": [],
            "claims": [{
                "id": "skill",
                "installer": "path.join(home, '.cursor')",
                "docs": ".cursor/skills",
                "readme": "~/.cursor/skills/rdap-q/",
            }],
        }],
    }
    text = "see .cursor/skills for skills"
    report = evaluate(spec, "path.join(home, '.cursor')", "~/.cursor/skills/rdap-q/", Path("/tmp"), 0, True)
    # evaluate fetches pins; with no URLs the corpus is empty, so docs fails.
    row = report["results"][0]
    assert row["installer"] and row["readme"] and not row["docs"]
    assert status_of(row) == "UNCHECKED"
    assert "goose toolkit add" not in report["forbidden"]
    bad = evaluate(spec, "nope", "goose toolkit add", Path("/tmp"), 0, True)
    assert bad["forbidden"] == ["goose toolkit add"]
    assert exit_code(bad) == 1
    print("self-test ok")
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Check RDAP-Q install paths against vendor docs")
    parser.add_argument("--vendors", type=Path, default=DEFAULT_VENDORS)
    parser.add_argument("--report", type=Path, default=ROOT / "reports" / "harness-audit" / "latest.md")
    parser.add_argument("--prompt", type=Path, default=ROOT / "reports" / "harness-audit" / "review-prompt.md")
    parser.add_argument("--cache", type=Path, default=None)
    parser.add_argument("--max-age-hours", type=float, default=144)
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args(argv)
    if args.self_test:
        return self_test()

    spec = json.loads(args.vendors.read_text())
    installer = (ROOT / spec["installer"]).read_text()
    readme = (ROOT / spec["readme"]).read_text()
    cache_dir = args.cache or args.report.parent / "cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    report = evaluate(spec, installer, readme, cache_dir, int(args.max_age_hours * 3600), args.refresh)
    report["checked_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    body = render(report)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(body)
    code = exit_code(report)
    if code == 0:
        if args.prompt.exists():
            args.prompt.unlink()
    else:
        args.prompt.write_text(review_prompt(report))
    sys.stdout.write(body)
    print(f"exit {code}")
    return code


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
