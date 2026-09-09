# Sketch Flow

Sketch Flow is a JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. It is designed for explanatory visuals such as fan-out diagrams, decision trees and risk-routing flows.

The project is independent from [chart.xkcd](https://github.com/timqian/chart.xkcd). Sketch Flow owns its diagram API and release lifecycle while providing an isolated compatibility entry point for the complete public API of the exact, tested `chart.xkcd` version `2.0.12`. See [ATTRIBUTION.md](ATTRIBUTION.md).

> **Status:** Pre-alpha release candidate. Layouts, portable export, browser visual regression and the pinned chart compatibility gallery are implemented. npm publishing remains deliberately disabled.

See the [API reference](docs/API.md) for the complete configuration, lifecycle and export surface.

## Automatic layouts

Choose `linear`, `fan-out`, or `decision-tree` to let Sketch Flow calculate coordinates while you retain control of node order, size, accent and edge routes. Presets are deterministic and reject configurations that do not fit the requested viewBox.

```js
import { Diagram } from '@aixacode/sketch-flow';

new Diagram(document.querySelector('svg'), {
  title: 'One review gate has been doing several jobs',
  layout: { type: 'fan-out', source: 'pull-request' },
  nodes: [
    { id: 'pull-request', label: 'PULL REQUEST', width: 430, height: 170 },
    { id: 'checks', label: 'MECHANICAL CHECKS', order: 1 },
    { id: 'judgment', label: 'SYSTEM JUDGMENT', order: 2, accent: true },
    { id: 'runtime', label: 'RUNTIME CONFIDENCE', order: 3 },
  ],
  edges: [
    { from: 'pull-request', to: 'checks' },
    { from: 'pull-request', to: 'judgment', route: 'orthogonal', accent: true },
    { from: 'pull-request', to: 'runtime' },
  ],
  options: { width: 1600, height: 900 },
});
```

`linear` supports `direction: 'left-to-right'` and `direction: 'top-to-bottom'`. `fan-out` supports both directions and uses `layout.source` (or an unambiguous source inferred from the edges). `decision-tree` uses `layout.decision` (or an unambiguous branching diamond), orders branches by the first node's `order`, and currently flows left-to-right. Use `columnGap` and `rowGap` on any preset.

Preset anchors are only defaults. An edge can still specify `fromAnchor`, `toAnchor`, and `route` to override its connector without supplying raw SVG paths.

### Explicit mobile composition

Responsive diagrams use a complete caller-authored alternative. This keeps semantic changes visible in configuration instead of silently rearranging the desktop graph.

```js
const config = {
  layout: { type: 'linear' },
  nodes: desktopNodes,
  edges: desktopEdges,
  mobile: {
    breakpoint: 640,
    layout: { type: 'linear', direction: 'top-to-bottom' },
    nodes: mobileNodes,
    edges: mobileEdges,
    options: { width: 480, height: 900 },
  },
};

const diagram = new Diagram(svg, config);
diagram.render(); // Reads svg.clientWidth when it is available.
diagram.render({ viewportWidth: 480 }); // Explicit and deterministic.
```

Call `render()` again after the container changes size. The pure API accepts the same choice through `renderDiagram(config, { id, viewportWidth })`.

## Portable export

Every diagram can produce a complete SVG document containing its font, filter, theme, accessibility title and description. PNG export renders that same document after browser fonts are ready and returns a `Promise<Blob>`.

```js
const svg = diagram.toSVG();
const transparentSvg = diagram.toSVG({ backgroundColor: 'transparent' });
const png = await diagram.toPNG({ scale: 2, backgroundColor: 'paper' });

diagram.downloadSVG('review-flow.svg');
await diagram.downloadPNG('review-flow.png', { scale: 2 });
```

`backgroundColor` accepts `paper` (the theme background), `transparent`, `null`, or a CSS colour. `toSVG({ embedFont: false })` is available when a consumer deliberately manages fonts externally. Responsive exports accept `viewportWidth` and use the same explicit mobile composition as browser rendering.

Functional integrations can use `serializeDiagram(config, options)` and `svgToPng(svg, { width, height, scale })`. PNG conversion and both download helpers require browser Canvas, Image, Blob and object URL APIs; SVG serialization itself is DOM-free.

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

The interactive example renders `Bar`, `StackedBar`, `Pie`, `Line`, `Combined`, `XY`, and `Radar` together with the approved diagrams. Its desktop/mobile composition controls and SVG/PNG download buttons exercise the public browser API.

## Run

Requires Node.js 22 or newer.

```bash
npm ci
npm run lint
npm test
npm run test:browser
npm run build
```

Run the browser example with:

```bash
npm run dev
```

The first browser-test run needs the pinned Chromium build:

```bash
npx playwright install chromium
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
