import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createRoughFilter,
  createTheme,
  fontFaceCss,
  renderArrowhead,
  renderBox,
  renderDiamond,
  renderFontDefinition,
  renderRoughFilter,
} from '../src/index.js';

test('creates deterministic themes without mutating the defaults', () => {
  const theme = createTheme({ seed: 7, accentColor: '#0055ff' });
  assert.equal(theme.seed, 7);
  assert.equal(theme.accentColor, '#0055ff');
  assert.ok(Object.isFrozen(theme));
  assert.throws(() => createTheme({ seed: -1 }), /non-negative integer/);
});

test('renders uniquely named deterministic roughness filters', () => {
  const filter = renderRoughFilter({ id: 'review-flow-rough', seed: 17, roughness: 4 });
  assert.match(filter, /id="review-flow-rough"/);
  assert.match(filter, /seed="17"/);
  assert.match(filter, /scale="4"/);
  assert.throws(() => renderRoughFilter({ id: 'bad id' }), /filter id/);
});

test('creates a roughness filter with the browser DOM API', () => {
  const document = {
    createElementNS(namespaceURI, tagName) {
      return {
        attributes: {},
        children: [],
        namespaceURI,
        tagName,
        append(...children) {
          this.children.push(...children);
        },
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      };
    },
  };

  const filter = createRoughFilter(document, { id: 'browser-rough', roughness: 3, seed: 9 });
  assert.equal(filter.tagName, 'filter');
  assert.equal(filter.attributes.id, 'browser-rough');
  assert.deepEqual(filter.children.map(({ tagName }) => tagName), ['feTurbulence', 'feDisplacementMap']);
  assert.equal(filter.children[0].attributes.seed, '9');
  assert.equal(filter.children[1].attributes.scale, '3');
});

test('renders reusable box and diamond primitives', () => {
  assert.equal(
    renderBox({ x: 10, y: 20, width: 200, height: 80, filterId: 'rough' }),
    '<rect x="10" y="20" width="200" height="80" rx="9" fill="#ffffff" stroke="#111111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#rough)"/>',
  );
  assert.match(
    renderDiamond({ x: 0, y: 0, width: 100, height: 80, stroke: '#1464e8' }),
    /points="50,0 100,40 50,80 0,40".*stroke="#1464e8"/,
  );
});

test('renders open arrowheads instead of filled SVG markers', () => {
  const arrowhead = renderArrowhead({
    from: { x: 0, y: 0 },
    tip: { x: 20, y: 0 },
    size: 10,
    stroke: '#1464e8',
    fill: '#1464e8',
  });
  assert.match(arrowhead, /d="M 10 4.2 L 20 0 L 10 -4.2"/);
  assert.match(arrowhead, /fill="none"/);
});

test('embeds the attributed chart.xkcd font in portable SVG', () => {
  assert.match(fontFaceCss(), /font-family: "xkcd"/);
  assert.match(fontFaceCss(), /data:application\/font-woff/);
  assert.match(renderFontDefinition(), /^<style type="text\/css">/);
});
