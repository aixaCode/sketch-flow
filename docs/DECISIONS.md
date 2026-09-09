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

## 2026-09-09 — Isolate exact chart compatibility

**Context:** Consumers should retain all public chart.xkcd chart constructors while Sketch Flow grows an independent diagram API.

**Decision:** Pin `chart.xkcd` to exact version `2.0.12` and re-export it only from `@aixacode/sketch-flow/charts`. Keep the main primitives entry point independent from it.

**Reason:** The isolated boundary preserves upstream functionality without coupling new diagram geometry or layout code to chart.xkcd internals. Exact pinning prevents silent upstream changes.

**When changing this:** Upgrade deliberately, run the constructor compatibility test, inspect browser rendering and document any upstream breaking change.

## 2026-09-09 — Share a portable hand-drawn visual foundation

**Context:** Article diagrams need the same bold hand-drawn font and rough strokes as chart.xkcd, while supporting layouts that are not charts.

**Decision:** Provide an embedded SVG font definition, deterministic roughness filter, immutable theme and reusable box, diamond and open-arrowhead primitives. The embedded font source is adapted from chart.xkcd and its MIT notice is retained under `licenses/`.

**Reason:** A common primitive layer keeps diagrams and charts visually coherent. Open path arrowheads match the reference layout more closely than filled SVG markers and remain controllable as ordinary geometry.

**When changing this:** Preserve deterministic seeded output and attribution, verify SVG portability, and visually compare strokes, font and arrowheads against the example.

## 2026-09-09 — Keep manual layout first-class

**Context:** Editorial diagrams need to reproduce approved compositions exactly, including a shared fan-out junction and consistent entry sides on destination nodes.

**Decision:** Require explicit node coordinates for the Phase 2 manual layout. Calculate connector endpoints from box or diamond boundaries by default, and allow cardinal `fromAnchor` and `toAnchor` overrides on individual edges. Support curve, straight and orthogonal route geometry without storing raw SVG paths in content configuration.

**Reason:** Automatic intersections provide safe defaults, while explicit anchors preserve the visual meaning and cleanliness of authored layouts. Keeping route intent declarative leaves geometry under library control.

**When changing this:** Retain the manual mode when adding presets, test all shape/route/anchor combinations, and visually verify shared junctions and unobscured arrowheads.
