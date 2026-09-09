# Project AI Context

This document is an onboarding map for engineers and coding agents. Keep it based on verified repository behavior and link to source instead of duplicating implementation details.

## Project snapshot

Sketch Flow is a pre-alpha JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. The first target consumers are static article pages that need fan-out and decision-tree diagrams plus portable SVG and PNG exports.

The repository is independent from `chart.xkcd`. A later compatibility entry point may expose the complete public API of an exact tested `chart.xkcd` npm version, but the diagram renderer must not depend on upstream internals.

## Important locations

| Path | Purpose |
| --- | --- |
| `src/index.js` | Public package entry point. |
| `test/` | Node test suite. |
| `vite.config.js` | ES-module library build. |
| `ATTRIBUTION.md` | Upstream inspiration and licence attribution. |
| `.github/workflows/ci.yml` | Required install, lint, test and build checks. |
| `.github/workflows/tag.yml` | SemVer tag automation for promoted `main` commits. |

## Runtime and data flow

The current package exports only a pre-alpha status marker. Planned runtime flow:

```text
diagram configuration
  -> validation
  -> layout in SVG viewBox coordinates
  -> node-boundary and edge geometry
  -> deterministic hand-drawn SVG rendering
  -> self-contained SVG or asynchronous PNG export
```

## External integrations

There are no runtime services, credentials or data stores. `chart.xkcd` is an attributed visual reference and a possible future exact-version compatibility dependency.

## Tests and verification

- `npm run lint` checks JavaScript sources, tests and configuration with ESLint.
- `npm test` runs the Node test suite.
- `npm run build` produces the ES-module package under `dist/` with Vite.

Browser rendering and visual-regression coverage are not implemented yet.

## Delivery and operations

Working branches start from `development` and merge back through squash PRs. Releases promote the exact tested commit through a disposable `release/*` branch and a non-squash PR to `main`. SemVer tags are created by CI on `main`.

There is no deployment target. npm publishing is disabled and `package.json` is marked private.

## Known gaps

- Diagram API and module structure are not implemented.
- Browser and image-export test infrastructure is not selected.
- The bundled font provenance and redistribution terms must be confirmed before embedding it.
- The final public npm package name and publishing ownership require explicit approval.
