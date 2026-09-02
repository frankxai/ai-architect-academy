# Domain recovery — aiarchitectacademy.com

Diagnosis 2026-09-02, read-only (`nslookup`, `curl -I`). No DNS record, alias, env var, or Vercel
setting was changed. Everything below is an observation or an instruction for Frank.

## What is actually wrong

The domain was never pointed at Vercel. It is still answering from IONOS.

```
$ nslookup -type=NS aiarchitectacademy.com
  ns1049.ui-dns.com / ns1070.ui-dns.org / ns1092.ui-dns.de / ns1118.ui-dns.biz   → IONOS

$ nslookup aiarchitectacademy.com
  A     217.160.0.152
  AAAA  2001:8d8:100f:f000::253                                                  → IONOS hosting

$ nslookup www.aiarchitectacademy.com
  A     217.160.0.152   (identical — www is an A record, not a CNAME)

$ curl -sI https://aiarchitectacademy.com     → no response at all (no TLS listener / no cert)
$ curl -sI https://www.aiarchitectacademy.com → no response at all
$ curl -sI http://aiarchitectacademy.com      → HTTP/1.1 404 Not Found, Server: nginx
```

Three things follow from that last line. The `Server: nginx` and the absence of any `x-vercel-id`
header prove **nothing Vercel is serving this hostname**. A Vercel-served apex answers from
`76.76.21.21` (or `cname.vercel-dns.com` for `www`) with `Server: Vercel`. And the total absence of
an HTTPS response means no certificate has ever been issued for this name — Vercel could not have
issued one, because it never received the ACME challenge.

So the 2026-09-01 "live fetch failed" in the manifest was not a flaky probe and not a deploy
failure. The record simply points somewhere else. `liveStatus: "pending-cutover"` is accurate.

## The second half of the bug

Estate memory records that the Vercel project's **Root Directory is `redirect-bridge`**. This
repository now also contains `site/` — a Next.js 16 app with its own `site/vercel.json`
(`framework: nextjs`), committed 2026-09-02 as the waitlist-first surface.

If DNS is cut over while Root Directory is still `redirect-bridge`, the domain will go live serving
the old redirect shell and the waitlist will stay invisible. **Fix the Root Directory before, or in
the same sitting as, the DNS change.** This is why the recovery below is ordered.

## The fix — Frank only

Every step needs an account Claude must not touch: IONOS DNS and Vercel project settings.

1. **Vercel → project `aiarchitectacademy` → Settings → Build → Root Directory:**
   change `redirect-bridge` to `site`. Confirm the framework preset reads Next.js.
2. **Vercel → same project → Settings → Domains:** confirm `aiarchitectacademy.com` and
   `www.aiarchitectacademy.com` are both listed. If not, add them; note the exact records Vercel
   asks for on that screen and prefer them over step 3 if they differ.
3. **IONOS → Domains → aiarchitectacademy.com → DNS:**
   - `A` `@` → `76.76.21.21` (replace `217.160.0.152`)
   - delete the `AAAA` `@` record — Vercel does not publish an apex AAAA, and a stale one will
     make IPv6 clients keep hitting IONOS after the A record is correct
   - `CNAME` `www` → `cname.vercel-dns.com` (replace the existing `www` A record; a hostname
     cannot hold both)
   - leave MX and any TXT records alone
4. **Deploy once from `main`** after Root Directory changes, so a production build exists for the
   alias to attach to.
5. **Wait for propagation** (IONOS TTL, typically ≤1h) and for Vercel to issue the certificate.

## How to know it worked — not "the page loaded"

```
nslookup aiarchitectacademy.com          # expect 76.76.21.21, and no AAAA
curl -sI https://aiarchitectacademy.com  # expect HTTP/2 200 and an x-vercel-id header
curl -sI https://www.aiarchitectacademy.com
```

The `x-vercel-id` header is the check that matters. A 200 alone can come from an IONOS parking page.

Then confirm the right surface is being served: the response body must contain the waitlist, not a
redirect. If it redirects, Root Directory did not change and step 1 was skipped or reverted.

## What stays true until then

`liveStatus` is `pending-cutover` and the row in `starlight/graph/products.graph.json` is
`UNGATED`. No checkout, no cohort date, no seat count, no countdown may appear on this surface —
only the waitlist. Nothing in this document authorises publishing a launch date.

## Not verified, and why

- Whether the domains are currently *attached* inside the Vercel project. That is not observable
  from DNS, and this run does not call Vercel. Step 2 exists to check it by hand.
- Whether Root Directory is still `redirect-bridge`. Taken from estate memory, not re-read this
  session. Step 1 is written to be a no-op if it is already `site`.
- No test of `.org` / `.academy` variants; they are separate properties with their own rows.
