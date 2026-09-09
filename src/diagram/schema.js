import { createTheme } from '../primitives/theme.js';

const SHAPES = new Set(['box', 'diamond']);
const ROUTES = new Set(['curve', 'straight', 'orthogonal']);
const ANCHORS = new Set(['auto', 'top', 'right', 'bottom', 'left']);
const THEME_KEYS = [
  'backgroundColor',
  'strokeColor',
  'accentColor',
  'textColor',
  'strokeWidth',
  'fontFamily',
  'roughness',
  'seed',
  'colors',
];

function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

function string(value, name, { optional = false } = {}) {
  if (optional && value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  return value;
}

function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new TypeError(`${name} must be greater than zero`);
  return value;
}

function nonNegative(value, name) {
  finite(value, name);
  if (value < 0) throw new TypeError(`${name} must be zero or greater`);
  return value;
}

function normalizeAccent(value, name) {
  if (value === undefined || typeof value === 'boolean') return value ?? false;
  return string(value, name);
}

function normalizeOptions(options = {}) {
  object(options, 'options');
  if (options.showTitle !== undefined && typeof options.showTitle !== 'boolean') {
    throw new TypeError('options.showTitle must be a boolean');
  }
  const width = positive(options.width ?? 1600, 'options.width');
  const height = positive(options.height ?? 1000, 'options.height');
  const padding = nonNegative(options.padding ?? 40, 'options.padding');
  const nodeWidth = positive(options.nodeWidth ?? 300, 'options.nodeWidth');
  const nodeHeight = positive(options.nodeHeight ?? 110, 'options.nodeHeight');
  const fontSize = positive(options.fontSize ?? 32, 'options.fontSize');
  const descriptionFontSize = positive(
    options.descriptionFontSize ?? 26,
    'options.descriptionFontSize',
  );
  const titleFontSize = positive(options.titleFontSize ?? 34, 'options.titleFontSize');
  const arrowSize = positive(options.arrowSize ?? 20, 'options.arrowSize');
  const arrowGap = nonNegative(options.arrowGap ?? 10, 'options.arrowGap');
  const descriptionGap = nonNegative(
    options.descriptionGap ?? 26,
    'options.descriptionGap',
  );

  return Object.freeze({
    ...options,
    width,
    height,
    padding,
    nodeWidth,
    nodeHeight,
    fontSize,
    descriptionFontSize,
    titleFontSize,
    arrowSize,
    arrowGap,
    descriptionGap,
    showTitle: options.showTitle ?? true,
  });
}

function normalizeNode(node, index, options) {
  object(node, `nodes[${index}]`);
  const id = string(node.id, `nodes[${index}].id`);
  const shape = node.shape ?? 'box';
  if (!SHAPES.has(shape)) {
    throw new TypeError(`nodes[${index}].shape must be "box" or "diamond"`);
  }

  const descriptionX = node.descriptionX === undefined
    ? undefined
    : finite(node.descriptionX, `nodes[${index}].descriptionX`);
  const descriptionWidth = node.descriptionWidth === undefined
    ? undefined
    : positive(node.descriptionWidth, `nodes[${index}].descriptionWidth`);
  const descriptionAnchor = node.descriptionAnchor ?? 'start';
  if (!['start', 'middle', 'end'].includes(descriptionAnchor)) {
    throw new TypeError(`nodes[${index}].descriptionAnchor must be "start", "middle" or "end"`);
  }

  return Object.freeze({
    ...node,
    id,
    label: string(node.label, `nodes[${index}].label`),
    description: string(node.description, `nodes[${index}].description`, { optional: true }),
    shape,
    x: finite(node.x, `nodes[${index}].x`),
    y: finite(node.y, `nodes[${index}].y`),
    width: positive(node.width ?? options.nodeWidth, `nodes[${index}].width`),
    height: positive(node.height ?? options.nodeHeight, `nodes[${index}].height`),
    fontSize: positive(node.fontSize ?? options.fontSize, `nodes[${index}].fontSize`),
    descriptionFontSize: positive(
      node.descriptionFontSize ?? options.descriptionFontSize,
      `nodes[${index}].descriptionFontSize`,
    ),
    descriptionX,
    descriptionWidth,
    descriptionAnchor,
    accent: normalizeAccent(node.accent, `nodes[${index}].accent`),
  });
}

function normalizeEdge(edge, index, nodeIds) {
  object(edge, `edges[${index}]`);
  const from = string(edge.from, `edges[${index}].from`);
  const to = string(edge.to, `edges[${index}].to`);
  if (!nodeIds.has(from)) throw new TypeError(`edges[${index}].from references missing node "${from}"`);
  if (!nodeIds.has(to)) throw new TypeError(`edges[${index}].to references missing node "${to}"`);
  if (from === to) throw new TypeError(`edges[${index}] cannot connect node "${from}" to itself`);

  const route = edge.route ?? 'curve';
  if (!ROUTES.has(route)) {
    throw new TypeError(`edges[${index}].route must be "curve", "straight" or "orthogonal"`);
  }
  const fromAnchor = edge.fromAnchor ?? 'auto';
  const toAnchor = edge.toAnchor ?? 'auto';
  if (!ANCHORS.has(fromAnchor)) {
    throw new TypeError(`edges[${index}].fromAnchor must be "auto", "top", "right", "bottom" or "left"`);
  }
  if (!ANCHORS.has(toAnchor)) {
    throw new TypeError(`edges[${index}].toAnchor must be "auto", "top", "right", "bottom" or "left"`);
  }

  return Object.freeze({
    ...edge,
    from,
    to,
    route,
    fromAnchor,
    toAnchor,
    accent: normalizeAccent(edge.accent, `edges[${index}].accent`),
  });
}

export function validateDiagramConfig(config) {
  object(config, 'diagram config');
  const layout = config.layout ?? { type: 'manual' };
  object(layout, 'layout');
  if ((layout.type ?? 'manual') !== 'manual') {
    throw new TypeError('Phase 2 supports only layout.type "manual"');
  }
  if (!Array.isArray(config.nodes) || config.nodes.length === 0) {
    throw new TypeError('nodes must be a non-empty array');
  }
  if (config.edges !== undefined && !Array.isArray(config.edges)) {
    throw new TypeError('edges must be an array');
  }

  const options = normalizeOptions(config.options);
  const nodes = config.nodes.map((node, index) => normalizeNode(node, index, options));
  const nodeIds = new Set();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) throw new TypeError(`duplicate node id "${node.id}"`);
    nodeIds.add(node.id);
  }
  const edges = (config.edges ?? []).map((edge, index) => normalizeEdge(edge, index, nodeIds));
  const title = string(config.title, 'title', { optional: true });
  const description = string(config.description, 'description', { optional: true });
  const ariaLabel = string(
    options.ariaLabel ?? title ?? 'Sketch Flow diagram',
    'options.ariaLabel',
  );
  const themeOverrides = Object.fromEntries(
    THEME_KEYS
      .filter((key) => options[key] !== undefined)
      .map((key) => [key, options[key]]),
  );

  return Object.freeze({
    ...config,
    title,
    description,
    layout: Object.freeze({ ...layout, type: 'manual' }),
    nodes: Object.freeze(nodes),
    edges: Object.freeze(edges),
    options,
    theme: createTheme(themeOverrides),
    ariaLabel,
  });
}
