# Project AI Context

This document is an onboarding map for engineers and coding agents. Keep it based on verified repository behavior and link to source instead of duplicating implementation details.

## Project snapshot

Sketch Flow is a pre-alpha JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. The first target consumers are static article pages that need fan-out and decision-tree diagrams plus portable SVG and PNG exports.

The repository is independent from `chart.xkcd`. The `./charts` compatibility entry point exposes the public API of the exact tested npm version `2.0.12`; the diagram renderer does not depend on upstream internals.

## Important locations

| Path | Purpose |
| --- | --- |
| `src/index.js` | Public diagram and visual-primitives entry point. |
| `src/charts.js` | Isolated chart.xkcd compatibility entry point. |
| `src/diagram/Diagram.js` | DOM orchestration and pure inner-SVG rendering API. |
| `src/diagram/schema.js` | Diagram defaults, validation and explicit mobile-config selection. |
| `src/diagram/layout/` | Manual, linear, fan-out and decision-tree positioning. |
| `src/diagram/export/` | Standalone SVG serialization, PNG conversion and browser downloads. |
| `src/diagram/geometry/` | Shape-boundary intersections and connector routes. |
| `src/diagram/render/` | Text wrapping and SVG composition. |
| `src/primitives/` | Theme, embedded font, roughness filter and SVG shape primitives. |
| `examples/` | Browser example for visual and compatibility checks. |
| `licenses/chart.xkcd-LICENSE` | Retained upstream MIT licence notice. |
| `test/` | Node test suite. |
| `vite.config.js` | ES-module library build. |
| `ATTRIBUTION.md` | Upstream inspiration and licence attribution. |
| `.github/workflows/ci.yml` | Required install, lint, test and build checks. |
| `.github/workflows/tag.yml` | SemVer tag automation for promoted `main` commits. |

## Runtime and data flow

Phase 3 implements the diagram runtime through deterministic SVG rendering:

```text
diagram configuration
  -> validation
  -> explicit manual coordinates or a structure-aware layout preset
  -> node-boundary and edge geometry
  -> deterministic hand-drawn SVG rendering
  -> SVG content in the caller-owned element
```

`Diagram` validates the complete configuration before mutating the target SVG. It assigns collision-free definition IDs, sets the viewBox and accessibility references, and supports complete configuration replacement through `update()`. `renderDiagram()` exposes pure inner-SVG markup for integrations that do not want DOM orchestration.

Automatic layout is dispatched by `src/diagram/layout/index.js`. Linear layouts order nodes along one axis. Fan-out validates a single source with ordered direct destinations. Decision-tree validates predecessor and branch topology, then places upper, middle and lower branch chains in shared depth columns. Presets account for node sizes and descriptions, fail with a fit error instead of clipping, and apply cardinal anchors only where the edge left them as `auto`.

A top-level `mobile` object is a full alternate diagram plus a positive `breakpoint`. `Diagram.render()` selects it from an explicit `viewportWidth` or a measurable `svg.clientWidth`; `renderDiagram()` accepts `viewportWidth` as an option. Selection does not mutate or infer a different graph. Callers re-render after a container resize.

Phase 4 export keeps SVG canonical. `serializeDiagram()` and `Diagram.toSVG()` wrap the same renderer output in a complete SVG document with namespace, fixed intrinsic dimensions, viewBox, accessibility references, embedded font and deterministic filter. Paper, transparent and caller-selected CSS backgrounds are supported.

`Diagram.toPNG()` serializes that SVG, waits for `document.fonts.ready` when available, decodes it as an object-URL image, and draws it to a scaled canvas before resolving a PNG `Blob`. Object URLs are always revoked. PNG conversion and download conveniences are browser-only; SVG serialization remains DOM-free.

Edges use automatic shape intersections unless the configuration selects a cardinal `fromAnchor` or `toAnchor`. Explicit anchors allow several fan-out edges to share one source junction. The destination endpoint is pulled back from the shape border before the open arrowhead is rendered, keeping the arrow visible above node layers.

## External integrations

There are no runtime services, credentials or data stores. `chart.xkcd` `2.0.12` is an exact production dependency used only by `src/charts.js`; upgrades are deliberate compatibility changes, not floating updates.

## Tests and verification

- `npm run lint` checks JavaScript sources, tests and configuration with ESLint.
- `npm test` runs the Node test suite.
- `npm run build` produces the ES-module package under `dist/` with Vite.

The example page provides browser rendering checks for the approved coordinate-free pull-request fan-out and risk decision-tree compositions. Automated browser and visual-regression coverage are not implemented yet.

## Delivery and operations

Working branches start from `development` and merge back through squash PRs. Releases promote the exact tested commit through a disposable `release/*` branch and a non-squash PR to `main`. SemVer tags are created by CI on `main`.

There is no deployment target. npm publishing is disabled and `package.json` is marked private.

## Known gaps

- Browser and image-export test infrastructure is not selected.
- The final public npm package name and publishing ownership require explicit approval.
