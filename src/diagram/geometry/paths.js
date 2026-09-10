function number(value) {
  return Number(value.toFixed(3));
}

function point(value) {
  return `${number(value.x)} ${number(value.y)}`;
}

export function routePath(start, end, route = 'curve', {
  fromAnchor = 'auto',
  toAnchor = 'auto',
} = {}) {
  if (!['curve', 'straight', 'orthogonal'].includes(route)) {
    throw new TypeError(`unknown edge route "${route}"`);
  }
  if (route === 'straight') {
    return {
      d: `M ${point(start)} L ${point(end)}`,
      arrowFrom: { ...start },
    };
  }

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const horizontal = Math.abs(deltaX) >= Math.abs(deltaY);

  if (route === 'orthogonal') {
    if (horizontal) {
      const middleX = start.x + deltaX / 2;
      const elbow = { x: middleX, y: end.y };
      return {
        d: `M ${point(start)} L ${number(middleX)} ${number(start.y)} L ${point(elbow)} L ${point(end)}`,
        arrowFrom: elbow,
      };
    }
    const middleY = start.y + deltaY / 2;
    const elbow = { x: end.x, y: middleY };
    return {
      d: `M ${point(start)} L ${number(start.x)} ${number(middleY)} L ${point(elbow)} L ${point(end)}`,
      arrowFrom: elbow,
    };
  }

  const defaultDirection = horizontal
    ? { x: Math.sign(deltaX) || 1, y: 0 }
    : { x: 0, y: Math.sign(deltaY) || 1 };
  const anchorDirection = (anchor, inbound = false) => {
    const directions = {
      top: { x: 0, y: inbound ? 1 : -1 },
      right: { x: inbound ? -1 : 1, y: 0 },
      bottom: { x: 0, y: inbound ? -1 : 1 },
      left: { x: inbound ? 1 : -1, y: 0 },
    };
    return directions[anchor] ?? defaultDirection;
  };
  const startDirection = anchorDirection(fromAnchor);
  const endDirection = anchorDirection(toAnchor, true);
  const directLength = Math.hypot(deltaX, deltaY);
  const minimumHandle = Math.min(40, directLength * 0.25);
  const handleLength = (direction) => direction.x === 0
    ? Math.max(minimumHandle, Math.abs(deltaY) * 0.55)
    : Math.max(minimumHandle, Math.abs(deltaX) * 0.55);
  const firstHandle = handleLength(startDirection);
  const secondHandle = handleLength(endDirection);
  const firstControl = {
    x: number(start.x + startDirection.x * firstHandle),
    y: number(start.y + startDirection.y * firstHandle),
  };
  const secondControl = {
    x: number(end.x - endDirection.x * secondHandle),
    y: number(end.y - endDirection.y * secondHandle),
  };
  return {
    d: `M ${point(start)} C ${point(firstControl)} ${point(secondControl)} ${point(end)}`,
    arrowFrom: secondControl,
  };
}
