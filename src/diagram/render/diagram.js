import { edgeEndpoints } from '../geometry/bounds.js';
import { routePath } from '../geometry/paths.js';
import { layoutDiagram } from '../layout/index.js';
import { renderFontDefinition } from '../../primitives/font.js';
import { renderRoughFilter } from '../../primitives/filter.js';
import { renderArrowhead, renderBox, renderDiamond } from '../../primitives/shapes.js';
import { escapeXml, renderTextLines, wrapText } from './text.js';

function colorFor(accent, theme) {
  if (typeof accent === 'string') {
    return Object.hasOwn(theme, accent) && typeof theme[accent] === 'string'
      ? theme[accent]
      : accent;
  }
  return accent ? theme.accentColor : theme.strokeColor;
}

function renderNode(node, config, filterId) {
  const { theme, options } = config;
  const stroke = colorFor(node.accent, theme);
  const shapeOptions = {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    stroke,
    strokeWidth: theme.strokeWidth,
    fill: theme.backgroundColor,
    filterId,
  };
  const shape = node.shape === 'diamond'
    ? renderDiamond(shapeOptions)
    : renderBox(shapeOptions);

  const labelWidth = node.shape === 'diamond' ? node.width * 0.62 : node.width - 40;
  const labelLines = wrapText(node.label, labelWidth, node.fontSize);
  const labelLineHeight = node.fontSize * 1.08;
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;
  const labelBaseline = centerY
    - ((labelLines.length - 1) * labelLineHeight) / 2
    + node.fontSize * 0.34;
  const label = renderTextLines({
    lines: labelLines,
    x: centerX,
    firstBaseline: labelBaseline,
    lineHeight: labelLineHeight,
    fontFamily: theme.fontFamily,
    fontSize: node.fontSize,
    fill: stroke,
    weight: 600,
  });

  let description = '';
  if (node.description) {
    const lines = wrapText(node.description, node.descriptionWidth ?? node.width, node.descriptionFontSize);
    description = renderTextLines({
      lines,
      x: node.descriptionX ?? node.x + 16,
      firstBaseline: node.y + node.height + options.descriptionGap + node.descriptionFontSize * 0.75,
      lineHeight: node.descriptionFontSize * 1.15,
      fontFamily: theme.fontFamily,
      fontSize: node.descriptionFontSize,
      fill: theme.textColor,
      anchor: node.descriptionAnchor ?? 'start',
      weight: 400,
      className: 'sketch-flow-description',
    });
  }

  return `<g data-node-id="${escapeXml(node.id)}">${shape}${label}${description}</g>`;
}

function renderEdge(edge, nodeById, config, filterId) {
  const source = nodeById.get(edge.from);
  const target = nodeById.get(edge.to);
  const { start, end } = edgeEndpoints(source, target, {
    endGap: config.options.arrowGap,
    fromAnchor: edge.fromAnchor,
    toAnchor: edge.toAnchor,
  });
  const routed = routePath(start, end, edge.route);
  const stroke = colorFor(edge.accent, config.theme);
  const common = `fill="none" stroke="${escapeXml(stroke)}" stroke-width="${config.theme.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`;
  const path = `<path d="${routed.d}" ${common}/>`;
  const arrowhead = renderArrowhead({
    from: routed.arrowFrom,
    tip: end,
    size: config.options.arrowSize,
    stroke,
    strokeWidth: config.theme.strokeWidth,
  });
  return `<g data-edge="${escapeXml(edge.from)}:${escapeXml(edge.to)}" filter="url(#${filterId})">${path}${arrowhead}</g>`;
}

export function renderDiagramMarkup(config, diagramId) {
  const { nodes, edges: laidOutEdges } = layoutDiagram(config);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const filterId = `${diagramId}-rough`;
  const titleId = `${diagramId}-title`;
  const descriptionId = `${diagramId}-description`;
  const fontStyleId = `${diagramId}-font`;
  const definitions = `<defs>${renderFontDefinition({ id: fontStyleId })}${renderRoughFilter({
    id: filterId,
    roughness: config.theme.roughness,
    seed: config.theme.seed,
  })}</defs>`;
  const accessibleTitle = `<title id="${titleId}">${escapeXml(config.ariaLabel)}</title>`;
  const accessibleDescription = config.description
    ? `<desc id="${descriptionId}">${escapeXml(config.description)}</desc>`
    : '';
  const background = `<rect width="${config.options.width}" height="${config.options.height}" fill="${escapeXml(config.theme.backgroundColor)}"/>`;
  const visualTitle = config.title && config.options.showTitle
    ? renderTextLines({
      lines: [config.title],
      x: config.options.padding,
      firstBaseline: config.options.padding + config.options.titleFontSize,
      lineHeight: config.options.titleFontSize,
      fontFamily: config.theme.fontFamily,
      fontSize: config.options.titleFontSize,
      fill: config.theme.textColor,
      anchor: 'start',
      weight: 600,
      className: 'sketch-flow-title',
    })
    : '';
  const edges = laidOutEdges.map((edge) => renderEdge(edge, nodeById, config, filterId)).join('');
  const renderedNodes = nodes.map((node) => renderNode(node, config, filterId)).join('');
  return `${definitions}${accessibleTitle}${accessibleDescription}${background}${visualTitle}<g class="sketch-flow-edges">${edges}</g><g class="sketch-flow-nodes">${renderedNodes}</g>`;
}
