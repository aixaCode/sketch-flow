import { wrapText } from '../render/text.js';

export function byOrder(left, right) {
  return left.order - right.order || left.id.localeCompare(right.id);
}

export function titleOffset(config) {
  const { options } = config;
  return config.title && options.showTitle
    ? options.padding + options.titleFontSize + 54
    : options.padding;
}

export function nodeFootprint(node, options) {
  if (!node.description) return { width: node.width, height: node.height };
  const lines = wrapText(
    node.description,
    node.descriptionWidth ?? node.width,
    node.descriptionFontSize,
  );
  return {
    width: node.width,
    height: node.height
      + options.descriptionGap
      + lines.length * node.descriptionFontSize * 1.15,
  };
}

export function availableFrame(config) {
  const top = titleOffset(config);
  return {
    left: config.options.padding,
    top,
    width: config.options.width - config.options.padding * 2,
    height: config.options.height - top - config.options.padding,
  };
}

export function assertFits(config, width, height) {
  const frame = availableFrame(config);
  if (width > frame.width || height > frame.height) {
    throw new RangeError(
      `${config.layout.type} layout needs ${Math.ceil(width)}x${Math.ceil(height)} pixels, `
      + `but only ${Math.ceil(frame.width)}x${Math.ceil(frame.height)} are available; `
      + 'increase options.width/options.height, reduce node sizes, or reduce layout gaps',
    );
  }
  return frame;
}

export function positioned(node, x, y) {
  return Object.freeze({
    ...node,
    x,
    y,
    center: Object.freeze({ x: x + node.width / 2, y: y + node.height / 2 }),
  });
}

export function withAnchors(edge, fromAnchor, toAnchor) {
  return Object.freeze({
    ...edge,
    fromAnchor: edge.fromAnchor === 'auto' ? fromAnchor : edge.fromAnchor,
    toAnchor: edge.toAnchor === 'auto' ? toAnchor : edge.toAnchor,
  });
}
