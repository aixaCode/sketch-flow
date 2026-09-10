function finiteNumber(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
  return value;
}

function positiveNumber(value, name) {
  finiteNumber(value, name);
  if (value <= 0) throw new TypeError(`${name} must be greater than zero`);
  return value;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function strokeAttributes(options = {}) {
  const stroke = escapeAttribute(options.stroke ?? '#111111');
  const fill = escapeAttribute(options.fill ?? '#ffffff');
  const strokeWidth = positiveNumber(options.strokeWidth ?? 4, 'strokeWidth');
  const filter = options.filterId ? ` filter="url(#${escapeAttribute(options.filterId)})"` : '';
  return `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${filter}`;
}

export function renderBox({ x, y, width, height, radius = 9, ...options }) {
  finiteNumber(x, 'x');
  finiteNumber(y, 'y');
  positiveNumber(width, 'width');
  positiveNumber(height, 'height');
  finiteNumber(radius, 'radius');
  if (radius < 0) throw new TypeError('radius must be zero or greater');

  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ${strokeAttributes(options)}/>`;
}

export function renderDiamond({ x, y, width, height, ...options }) {
  finiteNumber(x, 'x');
  finiteNumber(y, 'y');
  positiveNumber(width, 'width');
  positiveNumber(height, 'height');
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const points = `${centerX},${y} ${x + width},${centerY} ${centerX},${y + height} ${x},${centerY}`;
  return `<polygon points="${points}" ${strokeAttributes(options)}/>`;
}

export function arrowheadPoints({ from, tip, size = 15, wingRatio = 0.42 }) {
  finiteNumber(from?.x, 'from.x');
  finiteNumber(from?.y, 'from.y');
  finiteNumber(tip?.x, 'tip.x');
  finiteNumber(tip?.y, 'tip.y');
  positiveNumber(size, 'size');
  positiveNumber(wingRatio, 'wingRatio');

  const deltaX = tip.x - from.x;
  const deltaY = tip.y - from.y;
  const length = Math.hypot(deltaX, deltaY);
  if (length === 0) throw new TypeError('from and tip must not be the same point');

  const direction = { x: deltaX / length, y: deltaY / length };
  const perpendicular = { x: -direction.y, y: direction.x };
  const back = {
    x: tip.x - direction.x * size,
    y: tip.y - direction.y * size,
  };
  const wing = size * wingRatio;

  return {
    first: {
      x: back.x + perpendicular.x * wing,
      y: back.y + perpendicular.y * wing,
    },
    tip: { ...tip },
    second: {
      x: back.x - perpendicular.x * wing,
      y: back.y - perpendicular.y * wing,
    },
  };
}

export function renderArrowhead({ from, tip, size, wingRatio, ...options }) {
  const points = arrowheadPoints({ from, tip, size, wingRatio });
  const path = `M ${points.first.x} ${points.first.y} L ${points.tip.x} ${points.tip.y} L ${points.second.x} ${points.second.y}`;
  return `<path d="${path}" ${strokeAttributes({ ...options, fill: 'none' })}/>`;
}
