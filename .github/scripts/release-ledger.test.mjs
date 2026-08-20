import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { expectedPullRequests, loadLedger, validateLedger } from "./validate-release-ledger.mjs";

test("canonical ledger satisfies the Academy support contract", async () => {
  const ledger = await loadLedger();
  assert.deepEqual(validateLedger(ledger), []);
});

test("every merged pull request receipt appears exactly once", async () => {
  const ledger = await loadLedger();
  const actual = ledger.releases
    .flatMap((release) => release.sourcePullRequests)
    .sort((a, b) => a - b);
  assert.deepEqual(actual, expectedPullRequests);
});

test("consolidation, indexing, and production authority stay bounded", async () => {
  const ledger = await loadLedger();
  assert.equal(ledger.repository.role, "consolidated-learning-support");
  assert.equal(ledger.repository.indexing, "noindex");
  assert.equal(ledger.releasePolicy.githubReleaseMode, "draft-only");
  assert.equal(ledger.releasePolicy.canonicalDestination, "https://starlightintelligence.academy/");
  assert.equal(ledger.releasePolicy.domainMutation, "human-gated");
  assert.equal(ledger.releasePolicy.productionProof, "post-deploy-route-audit-required");
  assert.equal(ledger.production.liveVerification, "custom-domain-contract-mismatch-observed");
  assert.ok(ledger.releases.every((release) => release.status === "merged"));
  assert.ok(ledger.releases.every((release) => release.limitations.length > 0));
});

test("draft workflow cannot publish or tag an unreviewed branch", async () => {
  const workflow = await readFile(new URL("../workflows/draft-release.yml", import.meta.url), "utf8");
  assert.match(workflow, /tags:\s*\n\s*- "v\*\.\*\.\*"/);
  assert.match(workflow, /git cat-file -t/);
  assert.match(workflow, /git merge-base --is-ancestor/);
  assert.match(workflow, /gh release create/);
  assert.match(workflow, /--draft/);
  assert.doesNotMatch(workflow, /--draft=false|gh release edit|--latest/);
});

test("validator rejects missing, duplicated, or unauthorized history", async () => {
  const canonical = await loadLedger();

  const missing = structuredClone(canonical);
  missing.releases[0].sourcePullRequests = [];
  assert.ok(validateLedger(missing).length > 0);

  const duplicated = structuredClone(canonical);
  duplicated.releases[1].sourcePullRequests.push(21);
  assert.ok(validateLedger(duplicated).length > 0);

  const unauthorized = structuredClone(canonical);
  unauthorized.releasePolicy.domainMutation = "automatic";
  assert.ok(validateLedger(unauthorized).length > 0);
});
