import assert from "node:assert/strict";
import test from "node:test";

import { parseArgs, verifyPublicContract } from "../scripts/smoke.mjs";

const origin = "https://legacy.example/";
const destination = "https://academy.example/";
const securityHeaders = {
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "permissions-policy": "payment=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "x-robots-tag": "noindex, follow, noarchive",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
};

function createFetch({ redirectLocation = destination, protectedStatus } = {}) {
  return async (input) => {
    const url = new URL(input);

    if (protectedStatus) {
      return new Response("protected", { status: protectedStatus });
    }
    if (url.pathname === "/" || url.pathname === "/continue") {
      return new Response(null, {
        status: 308,
        headers: {
          location: redirectLocation,
          "strict-transport-security": securityHeaders["strict-transport-security"],
        },
      });
    }
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nAllow: /\n", {
        status: 200,
        headers: securityHeaders,
      });
    }

    return new Response("not found", { status: 404, headers: securityHeaders });
  };
}

test("parses an explicit source and destination without choosing either", () => {
  assert.deepEqual(parseArgs(["--origin", origin, "--destination", destination]), {
    origin,
    destination,
  });
});

test("returns a compact receipt for the complete public bridge contract", async () => {
  const receipt = await verifyPublicContract({
    origin,
    destination,
    fetchImpl: createFetch(),
    now: () => new Date("2026-09-01T12:00:00.000Z"),
  });

  assert.equal(receipt.ok, true);
  assert.equal(receipt.testedAt, "2026-09-01T12:00:00.000Z");
  assert.equal(receipt.origin, "https://legacy.example");
  assert.equal(receipt.destination, destination);
  assert.deepEqual(
    receipt.checks.map(({ route, status }) => [route, status]),
    [
      ["/", 308],
      ["/continue", 308],
      ["/robots.txt", 200],
      ["/__academy_domain_contract_not_found__", 404],
    ],
  );
});

test("fails when a redirect leaks the probe query into the destination", async () => {
  await assert.rejects(
    verifyPublicContract({
      origin,
      destination,
      fetchImpl: createFetch({ redirectLocation: `${destination}?domain_contract=1` }),
    }),
    /redirected to .*domain_contract=1/,
  );
});

test("fails closed when the public origin is protected", async () => {
  await assert.rejects(
    verifyPublicContract({
      origin,
      destination,
      fetchImpl: createFetch({ protectedStatus: 401 }),
    }),
    /returned 401; expected 308/,
  );
});

test("rejects unsafe or ambiguous command inputs", async () => {
  assert.throws(() => parseArgs(["--origin", origin]), /Missing required --destination/);
  await assert.rejects(
    verifyPublicContract({
      origin: "http://legacy.example/",
      destination,
      fetchImpl: createFetch(),
    }),
    /must use HTTPS/,
  );
  await assert.rejects(
    verifyPublicContract({
      origin,
      destination: origin,
      fetchImpl: createFetch(),
    }),
    /must be different origins/,
  );
});
