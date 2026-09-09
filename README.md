# Sketch Flow

Sketch Flow is a JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. It is designed for explanatory visuals such as fan-out diagrams, decision trees and risk-routing flows.

The project is independent from [chart.xkcd](https://github.com/timqian/chart.xkcd). Sketch Flow owns its diagram API and release lifecycle while providing an isolated compatibility entry point for the complete public API of the exact, tested `chart.xkcd` version `2.0.12`. See [ATTRIBUTION.md](ATTRIBUTION.md).

> **Status:** Pre-alpha. Phase 2 provides validated manual diagrams; automatic layout presets and SVG/PNG export arrive in later phases.

## Manual diagrams

Create an SVG element and pass it to `Diagram` with explicit viewBox coordinates. Nodes support boxes and diamonds, wrapped labels, descriptions below the shape and per-node accent colours. Set `accent` to `true`, a theme colour key such as `accentColor`, or a CSS colour. Edges support curved, straight and orthogonal routes.

```js
import { Diagram } from '@aixacode/sketch-flow';

const diagram = new Diagram(document.querySelector('svg'), {
  title: 'Risk determines the evidence a change needs',
  layout: { type: 'manual' },
  nodes: [
    { id: 'change', label: 'CHANGE', x: 40, y: 180, width: 220, height: 100 },
    {
      id: 'risk',
      label: 'WHAT CAN GO WRONG?',
      shape: 'diamond',
      x: 360,
      y: 130,
      width: 200,
      height: 200,
      accent: true,
    },
  ],
  edges: [
    {
      from: 'change',
      to: 'risk',
      route: 'curve',
      fromAnchor: 'right',
      toAnchor: 'left',
      accent: true,
    },
  ],
  options: { width: 800, height: 460, seed: 42 },
});

diagram.update(nextConfiguration);
```

Anchors may be `auto`, `top`, `right`, `bottom` or `left`. Explicit anchors make shared fan-out junctions and precise editorial routing possible without hard-coded SVG paths. `renderDiagram(configuration, { id })` returns the same inner SVG markup for non-DOM integrations.

## Visual primitives

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
