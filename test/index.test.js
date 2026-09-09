import assert from 'node:assert/strict';
import test from 'node:test';

import { projectStatus } from '../src/index.js';

test('exports the pre-alpha project status', () => {
  assert.equal(projectStatus, 'pre-alpha');
});
