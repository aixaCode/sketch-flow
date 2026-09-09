import { downloadBlob } from './export/download.js';
import { svgToPng } from './export/png.js';
import { serializeResolvedDiagram } from './export/svg.js';
import { renderDiagramMarkup } from './render/diagram.js';
import { resolveDiagramConfig, validateDiagramConfig } from './schema.js';

let nextDiagramId = 1;

function assertSvgElement(svg) {
  if (!svg || typeof svg.setAttribute !== 'function' || !('innerHTML' in svg)) {
    throw new TypeError('Diagram requires an SVG element');
  }
}

export function renderDiagram(config, { id = 'sketch-flow', viewportWidth } = {}) {
  if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(id)) {
    throw new TypeError('diagram id must be a valid SVG identifier');
  }
  const validated = validateDiagramConfig(config);
  return renderDiagramMarkup(resolveDiagramConfig(validated, viewportWidth), id);
}

export class Diagram {
  constructor(svg, config) {
    assertSvgElement(svg);
    this.svg = svg;
    this.id = `sketch-flow-${nextDiagramId}`;
    nextDiagramId += 1;
    this.update(config);
  }

  render({ viewportWidth } = {}) {
    const measuredWidth = viewportWidth ?? (
      Number.isFinite(this.svg.clientWidth) && this.svg.clientWidth > 0
        ? this.svg.clientWidth
        : undefined
    );
    const config = resolveDiagramConfig(this.config, measuredWidth);
    const { options } = config;
    const descriptionId = config.description ? ` ${this.id}-description` : '';
    this.svg.setAttribute('viewBox', `0 0 ${options.width} ${options.height}`);
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-labelledby', `${this.id}-title${descriptionId}`);
    this.svg.innerHTML = renderDiagramMarkup(config, this.id);
    return this;
  }

  update(config) {
    this.config = validateDiagramConfig(config);
    return this.render();
  }

  toSVG(options = {}) {
    const viewportWidth = this.#viewportWidth(options.viewportWidth);
    return serializeResolvedDiagram(resolveDiagramConfig(this.config, viewportWidth), {
      id: `${this.id}-export`,
      embedFont: options.embedFont,
      backgroundColor: options.backgroundColor,
    });
  }

  async toPNG({ scale = 2, backgroundColor = 'paper', viewportWidth } = {}) {
    const width = this.#viewportWidth(viewportWidth);
    const config = resolveDiagramConfig(this.config, width);
    const svg = this.toSVG({ viewportWidth: width, backgroundColor });
    return svgToPng(svg, {
      width: config.options.width,
      height: config.options.height,
      scale,
    });
  }

  downloadSVG(filename = 'diagram.svg', options = {}) {
    const svg = this.toSVG(options);
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename, '.svg');
    return this;
  }

  async downloadPNG(filename = 'diagram.png', options = {}) {
    const png = await this.toPNG(options);
    downloadBlob(png, filename, '.png');
    return this;
  }

  #viewportWidth(viewportWidth) {
    return viewportWidth ?? (
      Number.isFinite(this.svg.clientWidth) && this.svg.clientWidth > 0
        ? this.svg.clientWidth
        : undefined
    );
  }
}
