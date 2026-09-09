import {
  assertFits,
  byOrder,
  nodeFootprint,
  positioned,
  withAnchors,
} from './utils.js';

export function layoutLinear(config) {
  const nodes = [...config.nodes].sort(byOrder);
  const horizontal = config.layout.direction === 'left-to-right';
  const footprints = nodes.map((node) => nodeFootprint(node, config.options));
  const width = horizontal
    ? nodes.reduce((sum, node) => sum + node.width, 0)
      + config.layout.columnGap * Math.max(0, nodes.length - 1)
    : Math.max(...nodes.map((node) => node.width));
  const height = horizontal
    ? Math.max(...footprints.map((footprint) => footprint.height))
    : footprints.reduce((sum, footprint) => sum + footprint.height, 0)
      + config.layout.rowGap * Math.max(0, nodes.length - 1);
  const frame = assertFits(config, width, height);
  let cursor = horizontal
    ? frame.left + (frame.width - width) / 2
    : frame.top + (frame.height - height) / 2;

  const laidOut = nodes.map((node, index) => {
    const footprint = footprints[index];
    const x = horizontal
      ? cursor
      : frame.left + (frame.width - node.width) / 2;
    const y = horizontal
      ? frame.top + (frame.height - footprint.height) / 2
      : cursor;
    cursor += horizontal
      ? node.width + config.layout.columnGap
      : footprint.height + config.layout.rowGap;
    return positioned(node, x, y);
  });

  return {
    nodes: laidOut,
    edges: config.edges.map((edge) => withAnchors(
      edge,
      horizontal ? 'right' : 'bottom',
      horizontal ? 'left' : 'top',
    )),
  };
}
