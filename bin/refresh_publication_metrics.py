import json
import os
import re
import sys
from datetime import datetime, timezone
from http.client import HTTPException
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.error import HTTPError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


METRICS_FILE = Path("assets/json/publication_metrics.json")


def fetch(url):
    request = Request(url, headers={"User-Agent": "publication-metrics (https://jcwang-gh.github.io)"})
    with urlopen(request, timeout=12) as response:
        return response.read()


def scholar_citations(metric):
    author = metric["id"].split(":", 1)[0]
    query = urlencode({"user": author, "hl": "en", "pagesize": 100})
    profile = BeautifulSoup(fetch(f"https://scholar.google.com/citations?{query}"), "html.parser")
    for row in profile.select("tr.gsc_a_tr"):
        article = row.select_one("a.gsc_a_at[href]")
        if not article or parse_qs(urlsplit(article["href"]).query).get("citation_for_view") != [metric["id"]]:
            continue
        count_link = row.select_one("a.gsc_a_ac")
        label = count_link.get_text(strip=True) if count_link else ""
        if re.fullmatch(r"(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)", label):
            return int(label.replace(",", ""))
        break
    raise ValueError("Scholar did not return a numeric citation count for this paper")


def github_stars(metric):
    repository = json.loads(fetch(f"https://api.github.com/repos/{metric['id']}"))
    if not isinstance(repository, dict) or str(repository.get("full_name", "")).casefold() != metric["id"].casefold():
        raise ValueError("GitHub returned a different repository")
    return repository["stargazers_count"]


def published_snapshot():
    if not os.environ.get("GITHUB_ACTIONS"):
        return {}
    repository = os.environ["GITHUB_REPOSITORY"]
    try:
        return json.loads(fetch(f"https://raw.githubusercontent.com/{repository}/gh-pages/{METRICS_FILE}"))
    except HTTPError as error:
        if error.code == 404:  # First deployment with metrics.
            return {}
        raise


def valid_count(count):
    return type(count) is int and count >= 0


def refresh(metrics, published, today):
    readers = {"google_scholar": scholar_citations, "github": github_stars}
    for paper, sources in metrics.items():
        for source, metric in sources.items():
            previous = published.get(paper, {}).get(source, {})
            if (
                previous.get("id") == metric["id"]
                and valid_count(previous.get("count"))
                and isinstance(previous.get("checked_on"), str)
                and previous["checked_on"] >= metric["checked_on"]
            ):
                metric.update(count=previous["count"], checked_on=previous["checked_on"])
            try:
                count = readers[source](metric)
                if not valid_count(count):
                    raise ValueError("expected a nonnegative integer")
            except (OSError, HTTPException, ValueError, KeyError) as error:
                print(f"{paper} ({source}): {error}. Keeping {metric['count']} from {metric['checked_on']}.", file=sys.stderr)
            else:
                metric.update(count=count, checked_on=today)
                print(f"{paper} ({source}): {count} on {today}")


def main():
    metrics = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
    refresh(metrics, published_snapshot(), datetime.now(timezone.utc).date().isoformat())
    with TemporaryDirectory(dir=METRICS_FILE.parent) as directory:
        updated = Path(directory) / METRICS_FILE.name
        updated.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
        updated.replace(METRICS_FILE)


if __name__ == "__main__":
    main()
