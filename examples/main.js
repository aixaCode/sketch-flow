import { Diagram } from '../src/index.js';
import { charts } from '../src/charts.js';
import { reviewGateDiagram, riskDecisionDiagram } from './diagrams.js';

new Diagram(document.querySelector('.diagram'), reviewGateDiagram);
new Diagram(document.querySelector('.decision-diagram'), riskDecisionDiagram);

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
