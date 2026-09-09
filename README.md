# Sketch Flow

Sketch Flow is a JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. It is designed for explanatory visuals such as fan-out diagrams, decision trees and risk-routing flows.

The project is independent from [chart.xkcd](https://github.com/timqian/chart.xkcd). Sketch Flow owns its diagram API and release lifecycle while providing an isolated compatibility entry point for the complete public API of the exact, tested `chart.xkcd` version `2.0.12`. See [ATTRIBUTION.md](ATTRIBUTION.md).

> **Status:** Pre-alpha. Phase 1 provides the visual primitives; layout composition and SVG/PNG export arrive in later phases.

## Phase 1 API

The main entry point exports deterministic visual building blocks:

- an embedded `xkcd` font definition for portable SVG;
- a seeded roughness filter;
- immutable theme defaults;
- hand-drawn box and diamond shapes;
- geometry and rendering for open arrowheads.

```js
import {
  renderArrowhead,
  renderBox,
  renderFontDefinition,
  renderRoughFilter,
} from '@aixacode/sketch-flow';
```

Existing chart.xkcd functionality remains available through a separate entry point:

```js
import { charts } from '@aixacode/sketch-flow/charts';

new charts.Bar(svgElement, chartConfiguration);
```

The exact upstream dependency is pinned so updates do not silently alter this API. A deliberate dependency upgrade still requires compatibility testing.

## Run

Requires Node.js 22 or newer.

```bash
npm ci
npm run lint
npm test
npm run build
```

Run the browser example with:

```bash
npm run dev
```

## Deploy

Sketch Flow uses the SemVer profile described in [REPO-STANDARDS.md](REPO-STANDARDS.md). CI may create release tags after tested commits are promoted to `main`.

Publishing to npm is intentionally disabled. The package remains marked `private` until its public API, package ownership and release credentials are explicitly approved.

## Conventions

See [REPO-STANDARDS.md](REPO-STANDARDS.md) — conventional commits (no scopes),
explicit versioning profiles, lightweight GitFlow with disposable `release/*`
promotions, and SSH Git transport.

Coding agents start with [AGENTS.md](AGENTS.md). Claude Code imports the same
instructions through [CLAUDE.md](CLAUDE.md), avoiding duplicated agent rules.

---

**Bootstrapped from [aixaCode/repo-template](https://github.com/aixaCode/repo-template).**
