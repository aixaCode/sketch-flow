import { renderDiagramMarkup } from './render/diagram.js';
import { validateDiagramConfig } from './schema.js';

let nextDiagramId = 1;

function assertSvgElement(svg) {
  if (!svg || typeof svg.setAttribute !== 'function' || !('innerHTML' in svg)) {
    throw new TypeError('Diagram requires an SVG element');
  }
}

export function renderDiagram(config, { id = 'sketch-flow' } = {}) {
  if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(id)) {
    throw new TypeError('diagram id must be a valid SVG identifier');
  }
  return renderDiagramMarkup(validateDiagramConfig(config), id);
}

export class Diagram {
  constructor(svg, config) {
    assertSvgElement(svg);
    this.svg = svg;
    this.id = `sketch-flow-${nextDiagramId}`;
    nextDiagramId += 1;
    this.update(config);
  }

  render() {
    const { options } = this.config;
    const descriptionId = this.config.description ? ` ${this.id}-description` : '';
    this.svg.setAttribute('viewBox', `0 0 ${options.width} ${options.height}`);
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-labelledby', `${this.id}-title${descriptionId}`);
    this.svg.innerHTML = renderDiagramMarkup(this.config, this.id);
    return this;
  }

  update(config) {
    this.config = validateDiagramConfig(config);
    return this.render();
  }
}
