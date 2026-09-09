import assert from 'node:assert/strict';
import test from 'node:test';

import {
  Diagram,
  renderDiagram,
  validateDiagramConfig,
} from '../src/index.js';
import { anchorPoint, boundaryPoint, edgeEndpoints } from '../src/diagram/geometry/bounds.js';
import { routePath } from '../src/diagram/geometry/paths.js';
import { wrapText } from '../src/diagram/render/text.js';

function baseConfig(overrides = {}) {
  return {
    title: 'Review flow',
    nodes: [
      { id: 'source', label: 'PULL REQUEST', x: 0, y: 20, width: 100, height: 80 },
      { id: 'target', label: 'SYSTEM JUDGMENT', description: 'Architecture and intent', shape: 'diamond', x: 200, y: 20, width: 100, height: 80 },
    ],
    edges: [{ from: 'source', to: 'target', route: 'curve', accent: true }],
    options: { width: 400, height: 200, seed: 7 },
    ...overrides,
  };
}

test('validates and normalizes manual diagrams', () => {
  const config = validateDiagramConfig(baseConfig());
  assert.equal(config.layout.type, 'manual');
  assert.equal(config.nodes[0].shape, 'box');
  assert.equal(config.edges[0].route, 'curve');
  assert.equal(config.edges[0].fromAnchor, 'auto');
  assert.equal(config.theme.seed, 7);
  assert.equal(config.theme.width, undefined);
  assert.ok(Object.isFrozen(config.nodes));
});

test('reports duplicate nodes, missing endpoints and invalid dimensions', () => {
  assert.throws(
    () => validateDiagramConfig(baseConfig({
      nodes: [
        { id: 'same', label: 'ONE', x: 0, y: 0 },
        { id: 'same', label: 'TWO', x: 200, y: 0 },
      ],
    })),
    /duplicate node id "same"/,
  );
  assert.throws(
    () => validateDiagramConfig(baseConfig({ edges: [{ from: 'source', to: 'missing' }] })),
    /references missing node "missing"/,
  );
  assert.throws(
    () => validateDiagramConfig(baseConfig({
      nodes: [{ id: 'bad', label: 'BAD', x: 0, y: 0, width: 0 }],
    })),
    /width must be greater than zero/,
  );
  assert.throws(
    () => validateDiagramConfig(baseConfig({ layout: { type: 'fan-out' } })),
    /supports only layout.type "manual"/,
  );
  assert.throws(
    () => validateDiagramConfig(baseConfig({
      edges: [{ from: 'source', to: 'target', fromAnchor: 'center' }],
    })),
    /fromAnchor must be/,
  );
});

test('calculates box and diamond boundary intersections', () => {
  const box = { shape: 'box', x: 0, y: 0, width: 100, height: 80 };
  const diamond = { shape: 'diamond', x: 200, y: 0, width: 100, height: 80 };
  assert.deepEqual(boundaryPoint(box, { x: 250, y: 40 }), { x: 100, y: 40 });
  assert.deepEqual(boundaryPoint(diamond, { x: 50, y: 40 }), { x: 200, y: 40 });
  assert.deepEqual(anchorPoint(box, 'right'), { x: 100, y: 40 });
  assert.deepEqual(edgeEndpoints(box, diamond, { endGap: 10 }), {
    start: { x: 100, y: 40 },
    end: { x: 190, y: 40 },
    targetBoundary: { x: 200, y: 40 },
  });
  assert.deepEqual(edgeEndpoints(box, diamond, {
    endGap: 10,
    fromAnchor: 'right',
    toAnchor: 'left',
  }), {
    start: { x: 100, y: 40 },
    end: { x: 190, y: 40 },
    targetBoundary: { x: 200, y: 40 },
  });
});

test('creates straight, curved and orthogonal routes with arrow directions', () => {
  const start = { x: 0, y: 20 };
  const end = { x: 100, y: 80 };
  assert.equal(routePath(start, end, 'straight').d, 'M 0 20 L 100 80');
  assert.equal(routePath(start, end, 'curve').d, 'M 0 20 C 55 20 45 80 100 80');
  assert.deepEqual(routePath(start, end, 'orthogonal'), {
    d: 'M 0 20 L 50 20 L 50 80 L 100 80',
    arrowFrom: { x: 50, y: 80 },
  });
  assert.throws(() => routePath(start, end, 'loop'), /unknown edge route/);
});

test('wraps labels and splits words that exceed the available width', () => {
  assert.deepEqual(wrapText('human reviews behaviour', 110, 20), ['human', 'reviews', 'behaviour']);
  const longWord = wrapText('observability', 45, 20);
  assert.ok(longWord.length > 1);
  assert.equal(longWord.join(''), 'observability');
});

test('renders portable manual diagram markup with visible open arrows', () => {
  const markup = renderDiagram(baseConfig({
    edges: [{ from: 'source', to: 'target', route: 'curve', accent: 'accentColor' }],
  }), { id: 'review-flow' });
  assert.match(markup, /id="review-flow-font"/);
  assert.match(markup, /id="review-flow-rough"/);
  assert.match(markup, /data-edge="source:target"/);
  assert.match(markup, /class="sketch-flow-description"/);
  assert.doesNotMatch(markup, /<marker/);
  assert.match(markup, /fill="none" stroke="#1464e8"/);
});

test('escapes user-authored text and identifiers in SVG markup', () => {
  const markup = renderDiagram(baseConfig({
    title: 'Review & learn',
    nodes: [
      { id: 'source', label: '<script>', x: 0, y: 20, width: 300, height: 80 },
      { id: 'target', label: 'SAFE', x: 400, y: 20, width: 100, height: 80 },
    ],
  }), { id: 'safe-flow' });
  assert.match(markup, /Review &amp; learn/);
  assert.match(markup, /&lt;script&gt;/);
  assert.doesNotMatch(markup, /<script>/);
});

test('Diagram assigns collision-free SVG definitions and supports updates', () => {
  function fakeSvg() {
    return {
      attributes: {},
      innerHTML: '',
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
    };
  }
  const firstSvg = fakeSvg();
  const secondSvg = fakeSvg();
  const first = new Diagram(firstSvg, baseConfig());
  new Diagram(secondSvg, baseConfig());

  const firstId = firstSvg.innerHTML.match(/id="(sketch-flow-\d+)-rough"/)[1];
  const secondId = secondSvg.innerHTML.match(/id="(sketch-flow-\d+)-rough"/)[1];
  assert.notEqual(firstId, secondId);
  assert.equal(firstSvg.attributes.viewBox, '0 0 400 200');
  first.update(baseConfig({ options: { width: 800, height: 300 } }));
  assert.equal(firstSvg.attributes.viewBox, '0 0 800 300');
});
