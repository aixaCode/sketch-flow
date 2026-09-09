import assert from 'node:assert/strict';
import test from 'node:test';

import { Diagram, serializeDiagram } from '../src/index.js';
import { downloadBlob } from '../src/diagram/export/download.js';
import { svgToPng } from '../src/diagram/export/png.js';
import { reviewGateDiagram } from '../examples/diagrams.js';

function fakeSvg(clientWidth = 1200) {
  return {
    attributes: {},
    clientWidth,
    innerHTML: '',
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

test('serializes a complete self-contained SVG document', () => {
  const svg = serializeDiagram(reviewGateDiagram, { id: 'portable-review' });
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /viewBox="0 0 1600 1040" width="1600" height="1040"/);
  assert.match(svg, /role="img" aria-labelledby="portable-review-title portable-review-description"/);
  assert.match(svg, /@font-face/);
  assert.match(svg, /data:application\/font-woff/);
  assert.match(svg, /id="portable-review-rough"/);
  assert.match(svg, /<title id="portable-review-title">/);
  assert.match(svg, /<desc id="portable-review-description">/);
});

test('supports font-free and transparent SVG export', () => {
  const svg = serializeDiagram(reviewGateDiagram, {
    id: 'transparent-review',
    embedFont: false,
    backgroundColor: 'transparent',
  });
  assert.doesNotMatch(svg, /@font-face/);
  assert.doesNotMatch(svg, /<rect width="1600" height="1040" fill=/);
  assert.match(svg, /data-node-id="pull-request"/);
});

test('Diagram exports the responsive composition selected by width', () => {
  const diagram = new Diagram(fakeSvg(480), {
    layout: { type: 'linear' },
    nodes: [{ id: 'desktop', label: 'DESKTOP' }],
    mobile: {
      breakpoint: 640,
      layout: { type: 'linear', direction: 'top-to-bottom' },
      nodes: [{ id: 'mobile', label: 'MOBILE' }],
      options: { width: 480, height: 720 },
    },
  });
  const mobile = diagram.toSVG();
  const desktop = diagram.toSVG({ viewportWidth: 1000 });
  assert.match(mobile, /viewBox="0 0 480 720"/);
  assert.match(mobile, /data-node-id="mobile"/);
  assert.match(desktop, /data-node-id="desktop"/);
});

test('converts SVG to a scaled PNG after fonts are ready', async () => {
  const events = [];
  class FakeBlob {
    constructor(parts, options) {
      this.parts = parts;
      this.type = options.type;
    }
  }
  class FakeImage {
    set src(value) {
      this.source = value;
      events.push('image:load');
      queueMicrotask(() => this.onload());
    }
  }
  const canvas = {
    width: 0,
    height: 0,
    getContext() {
      return {
        drawImage(_image, x, y, width, height) {
          events.push(`draw:${x}:${y}:${width}:${height}`);
        },
      };
    },
    toBlob(callback, type) {
      events.push(`encode:${type}`);
      callback(new FakeBlob(['png'], { type }));
    },
  };
  const environment = {
    Blob: FakeBlob,
    Image: FakeImage,
    URL: {
      createObjectURL() {
        events.push('url:create');
        return 'blob:diagram';
      },
      revokeObjectURL(value) {
        events.push(`url:revoke:${value}`);
      },
    },
    document: {
      fonts: { ready: Promise.resolve().then(() => events.push('fonts:ready')) },
      createElement(tag) {
        assert.equal(tag, 'canvas');
        events.push('canvas:create');
        return canvas;
      },
    },
  };

  const png = await svgToPng('<svg></svg>', {
    width: 320,
    height: 180,
    scale: 2,
    environment,
  });
  assert.equal(png.type, 'image/png');
  assert.equal(canvas.width, 640);
  assert.equal(canvas.height, 360);
  assert.deepEqual(events, [
    'fonts:ready',
    'url:create',
    'image:load',
    'canvas:create',
    'draw:0:0:640:360',
    'encode:image/png',
    'url:revoke:blob:diagram',
  ]);
});

test('downloads through a temporary object URL and normalizes extensions', () => {
  const events = [];
  const anchor = {
    style: {},
    click() { events.push('click'); },
    remove() { events.push('remove'); },
  };
  const environment = {
    setTimeout(callback, delay) {
      assert.equal(delay, 0);
      events.push('schedule');
      callback();
    },
    URL: {
      createObjectURL() { return 'blob:download'; },
      revokeObjectURL(value) { events.push(`revoke:${value}`); },
    },
    document: {
      body: { append(value) { assert.equal(value, anchor); events.push('append'); } },
      createElement(tag) { assert.equal(tag, 'a'); return anchor; },
    },
  };
  downloadBlob({}, 'review-flow', '.svg', environment);
  assert.equal(anchor.download, 'review-flow.svg');
  assert.deepEqual(events, [
    'append',
    'click',
    'remove',
    'schedule',
    'revoke:blob:download',
  ]);
});
