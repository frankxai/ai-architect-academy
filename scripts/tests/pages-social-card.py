"""Verify machine-readable sharing metadata in the GitHub Pages document root."""
from html.parser import HTMLParser
from pathlib import Path
from struct import unpack
from xml.etree import ElementTree

DOCS = Path(__file__).resolve().parents[2] / "docs"
BASE = "https://frankxai.github.io/ai-architect-academy/"
IMAGE = "assets/social-card.png"
OLD_BASE = "https://ai-architect-academy.github.io/ai-architect-academy/"


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and "property" in attrs:
            self.tags.setdefault(attrs["property"], []).append(attrs.get("content"))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.tags.setdefault("canonical", []).append(attrs.get("href"))


card = (DOCS / IMAGE).read_bytes()
assert card.startswith(b"\x89PNG\r\n\x1a\n") and card[12:16] == b"IHDR"
width, height = unpack(">II", card[16:24])
assert (width, height) == (1200, 630)

count = 0
for page in sorted(DOCS.rglob("*.html")):
    source = page.read_text(encoding="utf-8")
    assert OLD_BASE not in source, page
    metadata = Metadata()
    metadata.feed(source)
    if page == DOCS / "index.html":
        assert metadata.tags.get("canonical") == [BASE], page
        assert metadata.tags.get("og:title"), page
    if "og:title" in metadata.tags or "og:image" in metadata.tags:
        for name, value in {
            "og:image": BASE + IMAGE,
            "og:image:type": "image/png",
            "og:image:width": str(width),
            "og:image:height": str(height),
        }.items():
            assert metadata.tags.get(name) == [value], (page, name)
        assert any(metadata.tags.get("og:image:alt", [])), page
        count += 1

assert f"Sitemap: {BASE}sitemap.xml" in (DOCS / "robots.txt").read_text()
links = ElementTree.parse(DOCS / "sitemap.xml").findall(".//{*}loc")
assert links
for loc in links:
    assert loc.text and loc.text.startswith(BASE), loc.text
    assert (DOCS / (loc.text[len(BASE):] or "index.html")).is_file(), loc.text

print(f"{count} sharing pages, {len(links)} sitemap URLs, {width}×{height} PNG")
