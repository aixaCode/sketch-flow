import { renderDiagramMarkup } from '../render/diagram.js';
import { escapeXml } from '../render/text.js';
import { resolveDiagramConfig, validateDiagramConfig } from '../schema.js';

function exportBackground(value, theme) {
  if (value === undefined || value === 'paper') return theme.backgroundColor;
  if (value === 'transparent' || value === null) return null;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('backgroundColor must be "paper", "transparent", null, or a CSS colour');
  }
  return value;
}

function assertExportId(id) {
  if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(id)) {
    throw new TypeError('export id must be a valid SVG identifier');
  }
}

export function serializeResolvedDiagram(config, {
  id = 'sketch-flow-export',
  embedFont = true,
  backgroundColor = 'paper',
} = {}) {
  assertExportId(id);
  if (typeof embedFont !== 'boolean') throw new TypeError('embedFont must be a boolean');
  const { width, height } = config.options;
  const descriptionId = config.description ? ` ${id}-description` : '';
  const background = exportBackground(backgroundColor, config.theme);
  const markup = renderDiagramMarkup(config, id, { embedFont, backgroundColor: background });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="${escapeXml(id)}-title${descriptionId}">${markup}</svg>`;
}

export function serializeDiagram(config, { viewportWidth, ...options } = {}) {
  const validated = validateDiagramConfig(config);
  return serializeResolvedDiagram(resolveDiagramConfig(validated, viewportWidth), options);
}

export { exportBackground };
