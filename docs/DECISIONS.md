# Project Decisions and Lessons

Record durable, non-obvious knowledge that prevents regressions. Date entries, link to code or commits where useful, and distinguish verified decisions from hypotheses.

## 2026-08-21 — Protect long-lived branches during promotions

**Context:** Repository settings may automatically delete a pull request's head
branch after merge. Using `development` itself as the head of a promotion PR can
therefore delete the long-lived integration branch. Restoring it from a stale
commit can silently omit already released work.

**Decision:** Before release, ensure `development` contains `main` and retest.
Create a disposable `release/<version-or-date>` branch at the exact tested
`development` commit, open it against `main`, and use a normal merge. Never use
`development` itself as the promotion PR head.

**Reason:** The disposable branch preserves exact tested commits while keeping
automatic head-branch deletion away from `development` and `main`.

**When changing this:** Compare both commit ancestry and content, verify the
release contains the tested tree, and confirm both long-lived branches still
exist after promotion.

## Entry template

```md
## YYYY-MM-DD — Decision title

**Context:** What prompted the decision?

**Decision:** What must future changes preserve?

**Reason:** Why was this approach chosen?

**When changing this:** What must be tested or reconsidered?
```

## 2026-09-09 — Own the diagram library independently

**Context:** The intended product needs flexible editorial layouts that are outside the chart-specific architecture of `chart.xkcd`.

**Decision:** Build Sketch Flow as an independent repository and package. Keep `aixaCode/chart.xkcd` as a reference fork and use only public package boundaries for any future compatibility integration.

**Reason:** Independent ownership allows a purpose-built layout, geometry and export API without coupling releases to upstream internals.

**When changing this:** Re-evaluate package ownership, release independence, upstream licence obligations and whether consumers would inherit breaking changes.

## 2026-09-09 — Keep publication disabled during pre-alpha

**Context:** The API, package ownership and font redistribution terms are not final.

**Decision:** Keep `private: true` in `package.json` and provide no npm publication workflow until an explicit release review approves them.

**Reason:** This prevents accidental publication under an incomplete or incorrect package identity.

**When changing this:** Confirm the public API, package name, npm ownership, licence notices, provenance of embedded assets and release credentials.
