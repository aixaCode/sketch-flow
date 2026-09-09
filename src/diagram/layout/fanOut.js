import {
  assertFits,
  byOrder,
  nodeFootprint,
  positioned,
  withAnchors,
} from './utils.js';

function findSource(config) {
  if (config.layout.source) return config.layout.source;
  const incoming = new Set(config.edges.map((edge) => edge.to));
  const candidates = config.nodes.filter(
    (node) => !incoming.has(node.id) && config.edges.some((edge) => edge.from === node.id),
  );
  if (candidates.length !== 1) {
    throw new TypeError('fan-out layout needs layout.source or exactly one source node');
  }
  return candidates[0].id;
}

export function layoutFanOut(config) {
  const sourceId = findSource(config);
  const source = config.nodes.find((node) => node.id === sourceId);
  if (!source) throw new TypeError(`layout.source references missing node "${sourceId}"`);
  const outgoing = config.edges.filter((edge) => edge.from === sourceId);
  const destinationIds = new Set(outgoing.map((edge) => edge.to));
  if (
    outgoing.length === 0
    || outgoing.length !== config.edges.length
    || destinationIds.size !== outgoing.length
    || destinationIds.size !== config.nodes.length - 1
    || config.nodes.some((node) => node.id !== sourceId && !destinationIds.has(node.id))
  ) {
    throw new TypeError('fan-out layout requires one source connected directly to every other node');
  }

  const destinations = config.nodes
    .filter((node) => node.id !== sourceId)
    .sort(byOrder);
  const horizontal = config.layout.direction === 'left-to-right';
  const sourceFootprint = nodeFootprint(source, config.options);
  const destinationFootprints = destinations.map((node) => nodeFootprint(node, config.options));
  const destinationWidth = Math.max(...destinations.map((node) => node.width));
  const destinationHeight = destinationFootprints.reduce((sum, item) => sum + item.height, 0)
    + config.layout.rowGap * Math.max(0, destinations.length - 1);
  const destinationRowWidth = destinations.reduce((sum, node) => sum + node.width, 0)
    + config.layout.columnGap * Math.max(0, destinations.length - 1);
  const width = horizontal
    ? source.width + config.layout.columnGap + destinationWidth
    : Math.max(source.width, destinationRowWidth);
  const height = horizontal
    ? Math.max(sourceFootprint.height, destinationHeight)
    : sourceFootprint.height + config.layout.rowGap
      + Math.max(...destinationFootprints.map((item) => item.height));
  const frame = assertFits(config, width, height);
  const laidOut = [];

  if (horizontal) {
    const left = frame.left + (frame.width - width) / 2;
    const top = frame.top + (frame.height - height) / 2;
    laidOut.push(positioned(source, left, top + (height - source.height) / 2));
    let cursor = top;
    for (let index = 0; index < destinations.length; index += 1) {
      const node = destinations[index];
      laidOut.push(positioned(node, left + source.width + config.layout.columnGap, cursor));
      cursor += destinationFootprints[index].height + config.layout.rowGap;
    }
  } else {
    const left = frame.left + (frame.width - width) / 2;
    const top = frame.top + (frame.height - height) / 2;
    laidOut.push(positioned(source, left + (width - source.width) / 2, top));
    let cursor = left;
    const rowTop = top + sourceFootprint.height + config.layout.rowGap;
    for (const node of destinations) {
      laidOut.push(positioned(node, cursor, rowTop));
      cursor += node.width + config.layout.columnGap;
    }
  }

  return {
    nodes: laidOut,
    edges: config.edges.map((edge) => withAnchors(
      edge,
      horizontal ? 'right' : 'bottom',
      horizontal ? 'left' : 'top',
    )),
  };
}
