import {
  renderArrowhead,
  renderBox,
  renderDiamond,
  renderFontDefinition,
  renderRoughFilter,
} from '../src/index.js';
import { charts } from '../src/charts.js';

const primitiveSvg = document.querySelector('.primitives');
const roughFilter = renderRoughFilter({ id: 'example-rough', seed: 42, roughness: 5 });
const box = renderBox({ x: 30, y: 120, width: 180, height: 90, filterId: 'example-rough' });
const diamond = renderDiamond({ x: 325, y: 80, width: 165, height: 165, stroke: '#1464e8', filterId: 'example-rough' });
const arrow = '<path d="M 215 165 C 255 165, 270 162, 305 162" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round" filter="url(#example-rough)"/>';
const arrowhead = renderArrowhead({ from: { x: 270, y: 162 }, tip: { x: 305, y: 162 }, filterId: 'example-rough' });

primitiveSvg.innerHTML = `<defs>${renderFontDefinition()}${roughFilter}</defs>${arrow}${arrowhead}${box}${diamond}<g fill="#111" font-family="xkcd" font-size="24" font-weight="600" text-anchor="middle"><text x="120" y="173">CHANGE</text><text x="407.5" y="151">WHAT CAN</text><text x="407.5" y="180">GO WRONG?</text></g>`;

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
