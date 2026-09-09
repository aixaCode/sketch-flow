export function chartExamples(charts) {
  return [
    {
      name: 'Bar',
      config: {
        title: 'Review paths by change count',
        xLabel: 'Path',
        yLabel: 'Changes',
        data: {
          labels: ['Low', 'Medium', 'High'],
          datasets: [{ data: [8, 5, 2] }],
        },
        options: { dataColors: ['#1464e8', '#dd4528', '#4ab74e'] },
      },
    },
    {
      name: 'StackedBar',
      config: {
        title: 'Evidence added during review',
        xLabel: 'Week',
        yLabel: 'Count',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [
            { label: 'Tests', data: [8, 12, 9, 14] },
            { label: 'Docs', data: [3, 5, 4, 6] },
            { label: 'Checks', data: [2, 4, 5, 7] },
          ],
        },
        options: { showLegend: true },
      },
    },
    {
      name: 'Pie',
      config: {
        title: 'Where review effort goes',
        data: {
          labels: ['Intent', 'Tests', 'Operations', 'Style'],
          datasets: [{ data: [40, 30, 20, 10] }],
        },
        options: {
          innerRadius: 0.55,
          legendPosition: charts.config.positionType.upRight,
        },
      },
    },
    {
      name: 'Line',
      config: {
        title: 'Review time as automation improves',
        xLabel: 'Month',
        yLabel: 'Hours',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Mechanical', data: [18, 15, 12, 8, 5, 3] },
            { label: 'Judgment', data: [6, 7, 8, 9, 10, 11] },
          ],
        },
      },
    },
    {
      name: 'Combined',
      config: {
        title: 'Changes and escaped issues',
        xLabel: 'Month',
        yLabel: 'Count',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            { label: 'Changes', type: 'bar', data: [24, 31, 29, 38, 42] },
            { label: 'Escaped', type: 'line', data: [5, 4, 4, 2, 1] },
          ],
        },
        options: { legendPosition: charts.config.positionType.upLeft },
      },
    },
    {
      name: 'XY',
      config: {
        title: 'Blast radius and review depth',
        xLabel: 'Blast radius',
        yLabel: 'Review depth',
        data: {
          datasets: [
            {
              label: 'Reversible',
              data: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }],
            },
            {
              label: 'One-way door',
              data: [{ x: 4, y: 7 }, { x: 5, y: 9 }, { x: 6, y: 10 }],
            },
          ],
        },
        options: {
          xTickCount: 4,
          yTickCount: 4,
          showLine: false,
          legendPosition: charts.config.positionType.downRight,
        },
      },
    },
    {
      name: 'Radar',
      config: {
        title: 'Review confidence',
        data: {
          labels: ['Intent', 'Tests', 'Runtime', 'Docs', 'Rollback'],
          datasets: [
            { label: 'Before', data: [1, 2, 1, 1, 2] },
            { label: 'After', data: [3, 3, 2, 2, 3] },
          ],
        },
        options: {
          showLegend: true,
          showLabels: true,
          dotSize: 0.8,
          legendPosition: charts.config.positionType.upRight,
        },
      },
    },
  ];
}
