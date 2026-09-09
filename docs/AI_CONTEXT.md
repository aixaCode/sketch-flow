# Project AI Context

This document is an onboarding map for engineers and coding agents. Keep it based on verified repository behavior and link to source instead of duplicating implementation details.

## Project snapshot

Sketch Flow is a pre-alpha JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. The first target consumers are static article pages that need fan-out and decision-tree diagrams plus portable SVG and PNG exports.

The repository is independent from `chart.xkcd`. The `./charts` compatibility entry point exposes the public API of the exact tested npm version `2.0.12`; the diagram primitives do not depend on upstream internals.

## Important locations

| Path | Purpose |
| --- | --- |
| `src/index.js` | Public visual-primitives entry point. |
| `src/charts.js` | Isolated chart.xkcd compatibility entry point. |
| `src/primitives/` | Theme, embedded font, roughness filter and SVG shape primitives. |
| `examples/` | Browser example for visual and compatibility checks. |
| `licenses/chart.xkcd-LICENSE` | Retained upstream MIT licence notice. |
| `test/` | Node test suite. |
| `vite.config.js` | ES-module library build. |
| `ATTRIBUTION.md` | Upstream inspiration and licence attribution. |
| `.github/workflows/ci.yml` | Required install, lint, test and build checks. |
| `.github/workflows/tag.yml` | SemVer tag automation for promoted `main` commits. |

## Runtime and data flow

Phase 1 implements deterministic, composable visual primitives. The later diagram runtime will use them in this flow:

```text
diagram configuration
  -> validation
  -> layout in SVG viewBox coordinates
  -> node-boundary and edge geometry
  -> deterministic hand-drawn SVG rendering
  -> self-contained SVG or asynchronous PNG export
```

## External integrations

There are no runtime services, credentials or data stores. `chart.xkcd` `2.0.12` is an exact production dependency used only by `src/charts.js`; upgrades are deliberate compatibility changes, not floating updates.

## Tests and verification

- `npm run lint` checks JavaScript sources, tests and configuration with ESLint.
- `npm test` runs the Node test suite.
- `npm run build` produces the ES-module package under `dist/` with Vite.

The example page provides a manual browser rendering check. Automated browser and visual-regression coverage are not implemented yet.

## Delivery and operations

Working branches start from `development` and merge back through squash PRs. Releases promote the exact tested commit through a disposable `release/*` branch and a non-squash PR to `main`. SemVer tags are created by CI on `main`.

There is no deployment target. npm publishing is disabled and `package.json` is marked private.

## Known gaps

- Diagram composition, layout and connector routing are not implemented.
- Browser and image-export test infrastructure is not selected.
- The final public npm package name and publishing ownership require explicit approval.
