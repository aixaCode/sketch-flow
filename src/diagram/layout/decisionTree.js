import {
  assertFits,
  byOrder,
  nodeFootprint,
  positioned,
  withAnchors,
} from './utils.js';

function outgoingMap(edges) {
  const map = new Map();
  for (const edge of edges) {
    const list = map.get(edge.from) ?? [];
    list.push(edge);
    map.set(edge.from, list);
  }
  return map;
}

function incomingMap(edges) {
  const map = new Map();
  for (const edge of edges) {
    const list = map.get(edge.to) ?? [];
    list.push(edge);
    map.set(edge.to, list);
  }
  return map;
}

function resolveDecision(config, outgoing) {
  if (config.layout.decision) return config.layout.decision;
  const candidates = config.nodes.filter(
    (node) => node.shape === 'diamond' && (outgoing.get(node.id)?.length ?? 0) > 1,
  );
  if (candidates.length !== 1) {
    throw new TypeError('decision-tree layout needs layout.decision or exactly one branching diamond');
  }
  return candidates[0].id;
}

function tracePredecessors(decisionId, nodeById, incoming) {
  const reversed = [];
  const seen = new Set([decisionId]);
  let current = decisionId;
  while ((incoming.get(current)?.length ?? 0) > 0) {
    const edges = incoming.get(current);
    if (edges.length !== 1) throw new TypeError('decision-tree layout does not support merged paths');
    current = edges[0].from;
    if (seen.has(current)) throw new TypeError('decision-tree layout does not support cycles');
    seen.add(current);
    reversed.push(nodeById.get(current));
  }
  return reversed.reverse();
}

function traceBranch(edge, nodeById, outgoing, incoming, visited) {
  const branch = [];
  let current = edge.to;
  while (current) {
    if (visited.has(current)) throw new TypeError('decision-tree layout does not support cycles or merged branches');
    if ((incoming.get(current)?.length ?? 0) !== 1) {
      throw new TypeError('decision-tree layout does not support merged branches');
    }
    visited.add(current);
    branch.push(nodeById.get(current));
    const next = outgoing.get(current) ?? [];
    if (next.length > 1) throw new TypeError('decision-tree branches must be linear after the decision');
    current = next[0]?.to;
  }
  return branch;
}

export function layoutDecisionTree(config) {
  const nodeById = new Map(config.nodes.map((node) => [node.id, node]));
  const outgoing = outgoingMap(config.edges);
  const incoming = incomingMap(config.edges);
  const decisionId = resolveDecision(config, outgoing);
  const decision = nodeById.get(decisionId);
  if (!decision) throw new TypeError(`layout.decision references missing node "${decisionId}"`);
  const branchEdges = [...(outgoing.get(decisionId) ?? [])]
    .sort((left, right) => byOrder(nodeById.get(left.to), nodeById.get(right.to)));
  if (branchEdges.length < 2) throw new TypeError('decision-tree layout requires at least two decision branches');

  const predecessors = tracePredecessors(decisionId, nodeById, incoming);
  const visited = new Set([decisionId, ...predecessors.map((node) => node.id)]);
  const branches = branchEdges.map((edge) => traceBranch(
    edge,
    nodeById,
    outgoing,
    incoming,
    visited,
  ));
  if (visited.size !== config.nodes.length) {
    throw new TypeError('decision-tree layout contains nodes disconnected from the decision');
  }

  const maxBranchDepth = Math.max(...branches.map((branch) => branch.length));
  const depthOffset = predecessors.length + 1;
  const columnWidths = Array.from(
    { length: depthOffset + maxBranchDepth },
    (_, depth) => {
      if (depth < predecessors.length) return predecessors[depth].width;
      if (depth === predecessors.length) return decision.width;
      return Math.max(...branches.map((branch) => branch[depth - depthOffset]?.width ?? 0));
    },
  );
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0)
    + config.layout.columnGap * (columnWidths.length - 1);
  const rowHeights = branches.map((branch) => Math.max(
    ...branch.map((node) => nodeFootprint(node, config.options).height),
  ));
  const branchHeight = rowHeights.reduce((sum, height) => sum + height, 0)
    + config.layout.rowGap * (rowHeights.length - 1);
  const centerPathHeight = Math.max(
    nodeFootprint(decision, config.options).height,
    ...predecessors.map((node) => nodeFootprint(node, config.options).height),
  );
  const totalHeight = Math.max(branchHeight, centerPathHeight);
  const frame = assertFits(config, totalWidth, totalHeight);
  const left = frame.left + (frame.width - totalWidth) / 2;
  const top = frame.top + (frame.height - totalHeight) / 2;
  const columnX = [];
  let xCursor = left;
  for (const width of columnWidths) {
    columnX.push(xCursor);
    xCursor += width + config.layout.columnGap;
  }
  const rowY = [];
  let yCursor = top + (totalHeight - branchHeight) / 2;
  for (const height of rowHeights) {
    rowY.push(yCursor);
    yCursor += height + config.layout.rowGap;
  }
  const centerY = top + totalHeight / 2;
  const laidOut = predecessors.map((node, depth) => positioned(
    node,
    columnX[depth] + (columnWidths[depth] - node.width) / 2,
    centerY - node.height / 2,
  ));
  laidOut.push(positioned(
    decision,
    columnX[predecessors.length] + (columnWidths[predecessors.length] - decision.width) / 2,
    centerY - decision.height / 2,
  ));
  branches.forEach((branch, row) => {
    branch.forEach((node, depth) => {
      const column = depthOffset + depth;
      laidOut.push(positioned(
        node,
        columnX[column] + (columnWidths[column] - node.width) / 2,
        rowY[row],
      ));
    });
  });

  return {
    nodes: laidOut,
    edges: config.edges.map((edge) => withAnchors(edge, 'right', 'left')),
  };
}
