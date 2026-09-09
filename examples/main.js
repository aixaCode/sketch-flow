import { Diagram } from '../src/index.js';
import { charts } from '../src/charts.js';
import { chartExamples } from './charts.js';
import { reviewGateDiagram, riskDecisionDiagram } from './diagrams.js';

const reviewGate = new Diagram(document.querySelector('.diagram'), reviewGateDiagram);
const riskDecision = new Diagram(document.querySelector('.decision-diagram'), riskDecisionDiagram);

document.querySelector('[data-export="svg"]').addEventListener('click', () => {
  reviewGate.downloadSVG('review-gate.svg');
});

document.querySelector('[data-export="png"]').addEventListener('click', async () => {
  await reviewGate.downloadPNG('review-gate.png', { scale: 2 });
});

document.querySelector('[data-preview="desktop"]').addEventListener('click', () => {
  reviewGate.render({ viewportWidth: 1200 });
  riskDecision.render({ viewportWidth: 1200 });
  document.querySelector('.diagram-grid').dataset.preview = 'desktop';
});

document.querySelector('[data-preview="mobile"]').addEventListener('click', () => {
  reviewGate.render({ viewportWidth: 375 });
  riskDecision.render({ viewportWidth: 375 });
  document.querySelector('.diagram-grid').dataset.preview = 'mobile';
});

for (const { name, config } of chartExamples(charts)) {
  const svg = document.querySelector(`[data-chart-name="${name}"] svg`);
  new charts[name](svg, config);
}
