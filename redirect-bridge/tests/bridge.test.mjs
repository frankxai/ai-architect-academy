import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const destination = "https://starlightintelligence.academy/";
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));

test("declares one exact canonical destination", () => {
  const canonicalLinks = html.match(/<link rel="canonical" href="[^"]+"/g) ?? [];
  assert.deepEqual(canonicalLinks, [`<link rel="canonical" href="${destination}"`]);
  assert.ok(html.includes(`<meta property="og:url" content="${destination}"`));
  assert.doesNotMatch(html, /starlightintelligence\.academy\/architect/i);
});

test("keeps the transition truthful and avoids a duplicate offer", () => {
  assert.match(html, /is consolidating into Starlight Intelligence Academy/i);
  assert.match(html, /No separate enrollment or offer lives on this address\./i);
  assert.doesNotMatch(html, /guaranteed|certification|cohort|price|discount|limited seats|job placement/i);
});

test("exposes a visible destination and a permanent continuation route", () => {
  assert.match(html, /href="\/continue"[^>]*>Continue to the Academy<\/a>/);
  assert.ok(html.includes(`href="${destination}"`));
  assert.deepEqual(config.redirects, [
    {
      source: "/continue",
      destination,
      permanent: true,
    },
  ]);
});

test("is intentionally noindex while allowing crawlers to observe the directive", () => {
  assert.match(html, /<meta name="robots" content="noindex, follow, noarchive"/);
  assert.equal(robots.trim(), "User-agent: *\nAllow: /");
  const header = config.headers[0].headers.find(({ key }) => key === "X-Robots-Tag");
  assert.equal(header?.value, "noindex, follow, noarchive");
});

test("sets the required security policy at every route", () => {
  const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]));
  assert.equal(config.headers[0].source, "/(.*)");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.match(headers["Permissions-Policy"], /payment=\(\)/);
});

test("includes accessible structure, focus treatment, and responsive safeguards", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-labelledby="transition-title"/);
  assert.match(html, /:focus-visible/);
  assert.match(html, /@media \(max-width: 640px\)/);
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(html, /min-width: 320px/);
});

test("keeps viewport height compatible and heading type fluid across the mobile breakpoint", () => {
  assert.equal((html.match(/min-height: 100vh;\s*min-height: 100svh;/g) ?? []).length, 2);
  assert.match(html, /font-size: clamp\(3\.2rem, calc\(1\.5rem \+ 8vw\), 7\.9rem\);/);

  const mobileRules = html.match(/@media \(max-width: 640px\)[\s\S]*?@media \(prefers-reduced-motion/)?.[0];
  assert.ok(mobileRules);
  assert.doesNotMatch(mobileRules, /h1\s*\{[^}]*font-size:/);
});
