import { Diagram } from '../src/index.js';
import { charts } from '../src/charts.js';
import { reviewGateDiagram, riskDecisionDiagram } from './diagrams.js';

const reviewGate = new Diagram(document.querySelector('.diagram'), reviewGateDiagram);
new Diagram(document.querySelector('.decision-diagram'), riskDecisionDiagram);

document.querySelector('[data-export="svg"]').addEventListener('click', () => {
  reviewGate.downloadSVG('review-gate.svg');
});

document.querySelector('[data-export="png"]').addEventListener('click', async () => {
  await reviewGate.downloadPNG('review-gate.png', { scale: 2 });
});

new charts.Bar(document.querySelector('.chart'), {
  title: 'Compatible charts',
  xLabel: 'Path',
  yLabel: 'Count',
  data: {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{ data: [8, 5, 2] }],
  },
  options: {
    dataColors: ['#1464e8', '#dd4528', '#4ab74e'],
  },
});
