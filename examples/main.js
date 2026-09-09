import { Diagram } from '../src/index.js';
import { charts } from '../src/charts.js';

new Diagram(document.querySelector('.diagram'), {
  title: 'One review gate has been doing several jobs',
  description: 'A pull request branches to mechanical checks, system judgment, runtime confidence and shared knowledge.',
  layout: { type: 'manual' },
  nodes: [
    { id: 'pull-request', label: 'PULL REQUEST', x: 55, y: 405, width: 430, height: 170 },
    { id: 'mechanical', label: 'MECHANICAL CHECKS', description: 'Rules, tests, consistency', x: 890, y: 95, width: 630, height: 115 },
    { id: 'judgment', label: 'SYSTEM JUDGMENT', description: 'Architecture, intent, blast radius', x: 890, y: 315, width: 630, height: 115, accent: true },
    { id: 'runtime', label: 'RUNTIME CONFIDENCE', description: 'QA, performance, real behaviour', x: 890, y: 555, width: 630, height: 115 },
    { id: 'knowledge', label: 'SHARED KNOWLEDGE', description: 'Who else can operate it?', x: 890, y: 800, width: 630, height: 115 },
  ],
  edges: [
    { from: 'pull-request', to: 'mechanical', route: 'curve', fromAnchor: 'right', toAnchor: 'left' },
    { from: 'pull-request', to: 'judgment', route: 'curve', fromAnchor: 'right', toAnchor: 'left', accent: true },
    { from: 'pull-request', to: 'runtime', route: 'curve', fromAnchor: 'right', toAnchor: 'left' },
    { from: 'pull-request', to: 'knowledge', route: 'curve', fromAnchor: 'right', toAnchor: 'left' },
  ],
  options: { width: 1600, height: 1040, seed: 42, roughness: 4.5, arrowGap: 14 },
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
