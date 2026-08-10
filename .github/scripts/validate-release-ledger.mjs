import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ledgerUrl = new URL("../../docs/releases/release-ledger.json", import.meta.url);

export const expectedPullRequests = [9, 10, 11, 13, 14, 17, 18, 19, 21];

export async function loadLedger() {
  return JSON.parse(await readFile(ledgerUrl, "utf8"));
}

export function validateLedger(ledger) {
  const errors = [];
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (ledger.schemaVersion !== "1.0") errors.push("schemaVersion must be 1.0");
  if (!datePattern.test(ledger.updatedAt ?? "")) errors.push("updatedAt must be YYYY-MM-DD");
  if (ledger.repository?.owner !== "frankxai" || ledger.repository?.name !== "ai-architect-academy") {
    errors.push("repository must be frankxai/ai-architect-academy");
  }
  if (ledger.repository?.publicDomain !== "aiarchitectacademy.com") {
    errors.push("publicDomain must be aiarchitectacademy.com");
  }
  if (ledger.repository?.role !== "consolidated-learning-support") {
    errors.push("repository role must remain consolidated-learning-support");
  }
  if (ledger.repository?.indexing !== "noindex") errors.push("legacy surface must remain noindex");
  if (ledger.releasePolicy?.githubReleaseMode !== "draft-only") {
    errors.push("GitHub releases must remain draft-only");
  }
  if (ledger.releasePolicy?.canonicalDestination !== "https://starlightintelligence.academy/") {
    errors.push("canonical destination must remain Starlight Intelligence Academy");
  }
  if (ledger.releasePolicy?.productionProof !== "post-deploy-route-audit-required") {
    errors.push("production proof must require a post-deploy route audit");
  }
  if (ledger.releasePolicy?.domainMutation !== "human-gated") {
    errors.push("domain mutation must remain human-gated");
  }
  if (!Array.isArray(ledger.releases) || ledger.releases.length !== 6) {
    errors.push("ledger must contain six grouped release records");
    return errors;
  }

  const slugs = new Set();
  const pullRequests = [];
  let previousDate = "9999-12-31";

  for (const [index, release] of ledger.releases.entries()) {
    const prefix = `releases[${index}]`;
    if (!slugPattern.test(release.slug ?? "")) errors.push(`${prefix}.slug is invalid`);
    if (slugs.has(release.slug)) errors.push(`${prefix}.slug is duplicated`);
    slugs.add(release.slug);
    if (!datePattern.test(release.mergedThrough ?? "")) errors.push(`${prefix}.mergedThrough is invalid`);
    if (!datePattern.test(release.recordedAt ?? "")) errors.push(`${prefix}.recordedAt is invalid`);
    if ((release.mergedThrough ?? "") > previousDate) errors.push("releases must be newest first");
    previousDate = release.mergedThrough;
    if (release.status !== "merged") errors.push(`${prefix}.status must be merged`);
    if (typeof release.title !== "string" || release.title.length < 8) errors.push(`${prefix}.title is too short`);
    if (typeof release.summary !== "string" || release.summary.length < 40) errors.push(`${prefix}.summary is too short`);
    if (!Array.isArray(release.highlights) || release.highlights.length < 2) errors.push(`${prefix} needs at least two highlights`);
    if (!Array.isArray(release.limitations) || release.limitations.length < 1) errors.push(`${prefix} needs at least one limitation`);
    if (!Array.isArray(release.sourcePullRequests) || release.sourcePullRequests.length < 1) {
      errors.push(`${prefix} needs source pull requests`);
    } else {
      pullRequests.push(...release.sourcePullRequests);
    }
  }

  const uniquePullRequests = new Set(pullRequests);
  if (uniquePullRequests.size !== pullRequests.length) errors.push("source pull requests must be unique across records");
  const actual = [...uniquePullRequests].sort((a, b) => a - b);
  if (JSON.stringify(actual) !== JSON.stringify(expectedPullRequests)) {
    errors.push(`expected exact PR coverage of ${expectedPullRequests.length}; received ${actual.length}`);
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ledger = await loadLedger();
  const errors = validateLedger(ledger);
  if (errors.length) {
    console.error(`Release ledger validation failed:\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  const pullRequestCount = ledger.releases.reduce(
    (total, release) => total + release.sourcePullRequests.length,
    0,
  );
  console.log(`Release ledger valid: ${ledger.releases.length} records, ${pullRequestCount} PR receipts.`);
}
