import assert from 'node:assert/strict';
import test from 'node:test';

import { charts } from '../src/charts.js';

test('exposes every chart.xkcd 2.0.12 public constructor', () => {
  for (const name of ['Bar', 'StackedBar', 'Pie', 'Line', 'Combined', 'XY', 'Radar']) {
    assert.equal(typeof charts[name], 'function', `${name} must be available`);
  }
  assert.equal(typeof charts.config, 'object');
});
