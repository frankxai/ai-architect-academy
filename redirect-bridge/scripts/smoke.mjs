#!/usr/bin/env node

import { pathToFileURL } from "node:url";

const REQUEST_TIMEOUT_MS = 15_000;

const expectedHeaders = {
  "content-security-policy": (value) => value.includes("frame-ancestors 'none'"),
  "permissions-policy": (value) => value.includes("payment=()"),
  "referrer-policy": (value) => value === "strict-origin-when-cross-origin",
  "x-content-type-options": (value) => value === "nosniff",
  "x-frame-options": (value) => value === "DENY",
  "x-robots-tag": (value) => value.includes("noindex"),
};

function fail(message) {
  throw new Error(message);
}

function normalizeOrigin(value, label) {
  if (!value) {
    fail(`Missing required ${label}.`);
  }

  const url = new URL(value);
  if (url.protocol !== "https:") {
    fail(`${label} must use HTTPS.`);
  }
  if (url.username || url.password || url.search || url.hash) {
    fail(`${label} must not contain credentials, a query, or a fragment.`);
  }
  if (url.pathname !== "/") {
    fail(`${label} must be an origin with no path.`);
  }

  return url;
}

function assertSecurityHeaders(response, route) {
  for (const [name, predicate] of Object.entries(expectedHeaders)) {
    const value = response.headers.get(name);
    if (!value || !predicate(value)) {
      fail(`${route} is missing or violates ${name}.`);
    }
  }
}

function assertTransportSecurity(response, route) {
  const value = response.headers.get("strict-transport-security");
  if (!value || !value.includes("max-age=")) {
    fail(`${route} is missing strict-transport-security.`);
  }
}

async function request(fetchImpl, url) {
  try {
    return await fetchImpl(url, {
      redirect: "manual",
      headers: { "user-agent": "academy-domain-contract/1.0" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    fail(`Request failed for ${url.href}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function parseArgs(argv) {
  const values = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key !== "--origin" && key !== "--destination") {
      fail(`Unknown argument: ${key}`);
    }
    if (values.has(key)) {
      fail(`Duplicate argument: ${key}`);
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      fail(`Missing value for ${key}.`);
    }

    values.set(key, value);
    index += 1;
  }

  if (!values.has("--origin")) {
    fail("Missing required --origin.");
  }
  if (!values.has("--destination")) {
    fail("Missing required --destination.");
  }

  return {
    origin: values.get("--origin"),
    destination: values.get("--destination"),
  };
}

export async function verifyPublicContract({
  origin,
  destination,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
}) {
  const source = normalizeOrigin(origin, "--origin");
  const target = normalizeOrigin(destination, "--destination");
  if (source.origin === target.origin) {
    fail("The redirect source and destination must be different origins.");
  }

  const checks = [];

  for (const route of ["/?domain_contract=1", "/continue?ref=domain-contract"]) {
    const url = new URL(route, source);
    const response = await request(fetchImpl, url);
    if (response.status !== 308) {
      fail(`${url.pathname} returned ${response.status}; expected 308.`);
    }

    const location = response.headers.get("location");
    if (!location) {
      fail(`${url.pathname} returned no Location header.`);
    }

    const resolvedLocation = new URL(location, url).href;
    if (resolvedLocation !== target.href) {
      fail(`${url.pathname} redirected to ${resolvedLocation}; expected ${target.href}.`);
    }

    // Vercel evaluates redirect rules before response-header rules. Redirects therefore prove
    // transport security and exact routing; content responses prove the remaining header policy.
    assertTransportSecurity(response, url.pathname);
    checks.push({ route: url.pathname, status: response.status, location: resolvedLocation });
  }

  const destinationResponse = await request(fetchImpl, target);
  if (destinationResponse.status !== 200) {
    fail(`The canonical destination returned ${destinationResponse.status}; expected 200.`);
  }
  assertTransportSecurity(destinationResponse, target.href);
  checks.push({ route: target.href, status: destinationResponse.status });

  const robotsUrl = new URL("/robots.txt", source);
  const robotsResponse = await request(fetchImpl, robotsUrl);
  if (robotsResponse.status !== 200) {
    fail(`/robots.txt returned ${robotsResponse.status}; expected 200.`);
  }
  assertTransportSecurity(robotsResponse, "/robots.txt");
  assertSecurityHeaders(robotsResponse, "/robots.txt");
  const robotsBody = await robotsResponse.text();
  if (robotsBody.trim() !== "User-agent: *\nAllow: /") {
    fail("/robots.txt does not expose the expected crawler-visible noindex bridge policy.");
  }
  checks.push({ route: "/robots.txt", status: robotsResponse.status });

  const missingUrl = new URL("/__academy_domain_contract_not_found__", source);
  const missingResponse = await request(fetchImpl, missingUrl);
  if (missingResponse.status !== 404) {
    fail(`${missingUrl.pathname} returned ${missingResponse.status}; expected 404.`);
  }
  assertTransportSecurity(missingResponse, missingUrl.pathname);
  assertSecurityHeaders(missingResponse, missingUrl.pathname);
  checks.push({ route: missingUrl.pathname, status: missingResponse.status });

  return {
    ok: true,
    testedAt: now().toISOString(),
    origin: source.origin,
    destination: target.href,
    checks,
  };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const receipt = await verifyPublicContract(options);
    console.log(JSON.stringify(receipt, null, 2));
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  }
}
