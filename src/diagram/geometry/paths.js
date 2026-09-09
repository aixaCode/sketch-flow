function number(value) {
  return Number(value.toFixed(3));
}

function point(value) {
  return `${number(value.x)} ${number(value.y)}`;
}

export function routePath(start, end, route = 'curve') {
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

  if (horizontal) {
    const controlOffset = deltaX * 0.55;
    const firstControl = { x: start.x + controlOffset, y: start.y };
    const secondControl = { x: end.x - controlOffset, y: end.y };
    return {
      d: `M ${point(start)} C ${point(firstControl)} ${point(secondControl)} ${point(end)}`,
      arrowFrom: secondControl,
    };
  }
  const controlOffset = deltaY * 0.55;
  const firstControl = { x: start.x, y: start.y + controlOffset };
  const secondControl = { x: end.x, y: end.y - controlOffset };
  return {
    d: `M ${point(start)} C ${point(firstControl)} ${point(secondControl)} ${point(end)}`,
    arrowFrom: secondControl,
  };
}
