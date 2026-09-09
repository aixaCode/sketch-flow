# Sketch Flow API

Sketch Flow has two public entry points. The package root owns diagrams and visual primitives. `@aixacode/sketch-flow/charts` delegates to the exact tested `chart.xkcd@2.0.12` namespace.

## Diagram

```js
import { Diagram } from '@aixacode/sketch-flow';

const diagram = new Diagram(svgElement, configuration);
```

The constructor validates the complete desktop and optional mobile configurations before writing to the supplied SVG element.

### Configuration

| Field | Required | Description |
| --- | --- | --- |
| `title` | no | Visible diagram heading and default accessible name. |
| `description` | no | Accessible SVG description. |
| `layout` | no | `manual`, `linear`, `fan-out`, or `decision-tree`; defaults to `manual`. |
| `nodes` | yes | Non-empty node array with unique IDs. |
| `edges` | no | Connections referencing existing node IDs. |
| `options` | no | ViewBox, typography, colour, roughness and accessibility options. |
| `mobile` | no | A complete alternate diagram plus a positive `breakpoint`. |

Manual nodes require finite `x` and `y` values. Presets calculate them and use `order`, `width`, `height`, `columnGap`, and `rowGap`. A fan-out can name `layout.source`; a decision tree can name `layout.decision` and currently flows left-to-right.

Nodes accept `id`, `label`, `description`, `shape`, `accent`, `order`, dimensions and text-size overrides. Edges require `from` and `to`, and accept `route` (`curve`, `straight`, or `orthogonal`), cardinal anchor overrides, and `accent`.

### Lifecycle

| Method | Result | Description |
| --- | --- | --- |
| `render({ viewportWidth })` | `Diagram` | Render the current configuration. Uses `svg.clientWidth` when no width is supplied. |
| `update(configuration)` | `Diagram` | Validate, replace and render the complete configuration. |
| `destroy()` | `Diagram` | Remove owned SVG content and attributes. Idempotent; later render/export calls fail. |

Call `render()` after the containing layout changes size. Sketch Flow does not install a resize observer.

### Export

| Method | Result | Description |
| --- | --- | --- |
| `toSVG(options)` | `string` | Complete standalone SVG with embedded font by default. |
| `toPNG(options)` | `Promise<Blob>` | PNG derived from the canonical SVG; defaults to 2×. |
| `downloadSVG(filename, options)` | `Diagram` | Browser download convenience. |
| `downloadPNG(filename, options)` | `Promise<Diagram>` | Asynchronous browser download convenience. |

Export options include `viewportWidth`, `backgroundColor`, and—on SVG—`embedFont`. Backgrounds may be `paper`, `transparent`, `null`, or a CSS colour. PNG options also accept a positive `scale`.

## Functional APIs

- `renderDiagram(configuration, { id, viewportWidth })` returns inner SVG markup.
- `serializeDiagram(configuration, options)` returns a complete SVG document without requiring the DOM.
- `svgToPng(svg, { width, height, scale })` converts SVG in a browser environment.
- `validateDiagramConfig(configuration)` normalizes and freezes validated configuration.
- `resolveDiagramConfig(configuration, viewportWidth)` selects an already validated mobile or desktop configuration.

The package root also exports theme, font, rough-filter, box, diamond and open-arrow primitives. See `src/index.js` for the authoritative export list.

## Chart compatibility

```js
import { charts } from '@aixacode/sketch-flow/charts';

new charts.Line(svgElement, chartConfiguration);
```

The compatibility namespace exposes `Bar`, `StackedBar`, `Pie`, `Line`, `Combined`, `XY`, `Radar`, and upstream `config`. It is intentionally isolated so chart code is absent from diagram-only bundles. The dependency is pinned; upgrades require constructor, Chromium-rendering and visual-regression checks.

## Errors and environment boundaries

Validation throws before rendering for malformed data, missing endpoints, unsupported topology and layouts that cannot fit their configured viewBox. SVG rendering and serialization are DOM-free. `Diagram`, PNG conversion and download methods require their corresponding browser APIs.

The package remains private during pre-alpha. A public npm name, ownership and publishing credentials require a separate explicit release decision.
