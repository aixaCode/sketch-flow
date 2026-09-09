import { layoutDecisionTree } from './decisionTree.js';
import { layoutFanOut } from './fanOut.js';
import { layoutLinear } from './linear.js';
import { layoutManual } from './manual.js';

export function layoutDiagram(config) {
  switch (config.layout.type) {
    case 'manual':
      return { nodes: layoutManual(config.nodes), edges: config.edges };
    case 'linear':
      return layoutLinear(config);
    case 'fan-out':
      return layoutFanOut(config);
    case 'decision-tree':
      return layoutDecisionTree(config);
    default:
      throw new TypeError(`unknown layout type "${config.layout.type}"`);
  }
}
