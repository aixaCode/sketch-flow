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

## 2026-09-09 — Keep automatic layouts deterministic and structure-aware

**Context:** The approved fan-out and risk-routing compositions should be authored without hard-coded coordinates or SVG paths, while retaining editorial order and connector control.

**Decision:** Provide linear, fan-out and decision-tree presets that validate their expected graph structure, respect per-node sizes and ordering, and supply cardinal anchors only when an edge leaves them automatic. Keep manual layout available for exceptional compositions, and fail clearly when a preset cannot fit its configured viewBox.

**Reason:** Small, opinionated algorithms reproduce the recurring article layouts predictably without adopting a general graph engine or hiding layout mistakes through clipping and overlap.

**When changing this:** Preserve deterministic output, topology and fit errors, explicit route/anchor overrides, coordinate-free approved examples and manual-layout compatibility.

## 2026-09-09 — Make mobile composition explicit

**Context:** A narrow article layout may need different wording, graph structure or direction—not merely scaled desktop coordinates.

**Decision:** Accept a complete alternate diagram under `mobile`, selected by a positive `breakpoint`. Use an explicit render width when supplied, otherwise a measurable SVG client width, and require callers to render again after resize.

**Reason:** Caller-owned mobile semantics are reviewable and deterministic. Avoiding implicit graph rewrites and resize observers keeps Phase 3 behavior small and lifecycle-free.

**When changing this:** Test desktop and mobile configurations independently, preserve pure width-based selection, and introduce automatic resize lifecycle only with a documented teardown API.

## 2026-09-09 — Derive every portable format from canonical SVG

**Context:** Article tooling needs editable SVG and high-resolution PNG without visual drift between browser rendering and downloaded assets.

**Decision:** Serialize a complete SVG document from the same validated configuration and renderer used on screen. Embed the attributed font by default, retain accessibility metadata and deterministic filter IDs, and derive PNG by decoding that SVG into a scaled browser canvas after font readiness. Support paper and transparent backgrounds explicitly.

**Reason:** One rendering path prevents separate SVG and raster implementations from diverging. Embedded data assets make SVG portable, while asynchronous font and image readiness avoids fallback-font captures.

**When changing this:** Verify exported SVG has no external references, compare browser/SVG/PNG rendering, test object-URL cleanup and keep PNG APIs asynchronous.

## 2026-09-10 — Gate releases with deterministic Chromium baselines

**Context:** Unit tests verify geometry and markup but cannot detect browser font, sizing, layering or chart-rendering regressions.

**Decision:** Run Playwright with a pinned Chromium build in CI. Commit snapshots for both approved diagrams at 375, 768 and 1440 pixels and for a gallery exercising every chart.xkcd constructor. Replace `Math.random` with a seeded generator before gallery scripts load because the upstream chart renderer otherwise produces nondeterministic rough geometry.

**Reason:** Browser screenshots cover the visual contract that matters to article production while deterministic inputs keep failures actionable. Moderate pixel tolerance absorbs platform antialiasing without accepting structural layout changes.

**When changing this:** Review baseline images rather than updating them blindly, keep every supported constructor in the gallery, and test changes with the same pinned browser version used by CI.
