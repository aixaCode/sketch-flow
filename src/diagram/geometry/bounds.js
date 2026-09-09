function center(node) {
  return node.center ?? {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

export function boundaryPoint(node, toward) {
  const origin = center(node);
  const deltaX = toward.x - origin.x;
  const deltaY = toward.y - origin.y;
  if (deltaX === 0 && deltaY === 0) {
    throw new TypeError(`cannot calculate a boundary point for overlapping node centers`);
  }

  const halfWidth = node.width / 2;
  const halfHeight = node.height / 2;
  let scale;
  if (node.shape === 'diamond') {
    scale = 1 / (Math.abs(deltaX) / halfWidth + Math.abs(deltaY) / halfHeight);
  } else {
    scale = Math.min(
      deltaX === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(deltaX),
      deltaY === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(deltaY),
    );
  }

  return {
    x: origin.x + deltaX * scale,
    y: origin.y + deltaY * scale,
  };
}

export function anchorPoint(node, anchor, toward) {
  if (anchor === 'auto') return boundaryPoint(node, toward);
  const origin = center(node);
  const offsets = {
    top: { x: 0, y: -node.height / 2 },
    right: { x: node.width / 2, y: 0 },
    bottom: { x: 0, y: node.height / 2 },
    left: { x: -node.width / 2, y: 0 },
  };
  const offset = offsets[anchor];
  if (!offset) throw new TypeError(`unknown node anchor "${anchor}"`);
  return { x: origin.x + offset.x, y: origin.y + offset.y };
}

export function pullBackPoint(from, to, distance) {
  if (distance === 0) return { ...to };
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY);
  if (length === 0) throw new TypeError('cannot pull back a zero-length segment');
  const appliedDistance = Math.min(distance, length / 2);
  return {
    x: to.x - (deltaX / length) * appliedDistance,
    y: to.y - (deltaY / length) * appliedDistance,
  };
}

export function edgeEndpoints(source, target, {
  endGap = 10,
  fromAnchor = 'auto',
  toAnchor = 'auto',
} = {}) {
  if (!Number.isFinite(endGap) || endGap < 0) {
    throw new TypeError('endGap must be zero or greater');
  }
  const sourceCenter = center(source);
  const targetCenter = center(target);
  const start = anchorPoint(source, fromAnchor, targetCenter);
  const targetBoundary = anchorPoint(target, toAnchor, sourceCenter);
  return {
    start,
    end: pullBackPoint(start, targetBoundary, endGap),
    targetBoundary,
  };
}
