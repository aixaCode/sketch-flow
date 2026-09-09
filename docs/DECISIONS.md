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
