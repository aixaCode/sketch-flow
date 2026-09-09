export const reviewGateDiagram = {
  title: 'One review gate has been doing several jobs',
  description: 'A pull request branches to mechanical checks, system judgment, runtime confidence and shared knowledge.',
  layout: { type: 'fan-out', source: 'pull-request', rowGap: 55 },
  nodes: [
    { id: 'pull-request', label: 'PULL REQUEST', width: 430, height: 170 },
    { id: 'mechanical', label: 'MECHANICAL CHECKS', description: 'Rules, tests, consistency', width: 630, height: 115, order: 1 },
    { id: 'judgment', label: 'SYSTEM JUDGMENT', description: 'Architecture, intent, blast radius', width: 630, height: 115, order: 2, accent: true },
    { id: 'runtime', label: 'RUNTIME CONFIDENCE', description: 'QA, performance, real behaviour', width: 630, height: 115, order: 3 },
    { id: 'knowledge', label: 'SHARED KNOWLEDGE', description: 'Who else can operate it?', width: 630, height: 115, order: 4 },
  ],
  edges: [
    { from: 'pull-request', to: 'mechanical' },
    { from: 'pull-request', to: 'judgment', accent: true },
    { from: 'pull-request', to: 'runtime' },
    { from: 'pull-request', to: 'knowledge' },
  ],
  options: { width: 1600, height: 1040, seed: 42, roughness: 4.5, arrowGap: 14 },
};

export const riskDecisionDiagram = {
  title: 'Match the review to the risk',
  description: 'A change is classified by what can go wrong, then sent through a proportionate review path.',
  layout: { type: 'decision-tree', decision: 'risk', columnGap: 40, rowGap: 75 },
  nodes: [
    { id: 'change', label: 'CHANGE', width: 220, height: 130 },
    { id: 'risk', label: 'WHAT CAN\nGO WRONG?', shape: 'diamond', width: 300, height: 290, accent: true },
    { id: 'low', label: 'LOW RISK', width: 270, height: 120, order: 1, accent: true },
    { id: 'low-detect', label: 'Reversible +\neasy to detect', width: 300, height: 130, accent: true },
    { id: 'low-checks', label: 'CHECKS + AI +\nOBSERVABILITY', width: 320, height: 130, accent: true },
    { id: 'medium', label: 'MEDIUM RISK', width: 270, height: 120, order: 2 },
    { id: 'medium-review', label: 'Human reviews\nbehaviour, tests\nand system fit', width: 300, height: 170 },
    { id: 'high', label: 'HIGH RISK /\nONE-WAY DOOR', width: 290, height: 145, order: 3 },
    { id: 'high-judgment', label: 'Human judgment\nbefore\nimplementation', width: 300, height: 170 },
    { id: 'high-rollout', label: 'Focused review +\nrollout plan', width: 320, height: 145 },
  ],
  edges: [
    { from: 'change', to: 'risk', route: 'straight' },
    { from: 'risk', to: 'low' },
    { from: 'low', to: 'low-detect', route: 'straight' },
    { from: 'low-detect', to: 'low-checks', route: 'straight' },
    { from: 'risk', to: 'medium', route: 'straight' },
    { from: 'medium', to: 'medium-review', route: 'straight' },
    { from: 'risk', to: 'high' },
    { from: 'high', to: 'high-judgment', route: 'straight' },
    { from: 'high-judgment', to: 'high-rollout', route: 'straight' },
  ],
  options: { width: 1680, height: 1030, seed: 21, roughness: 4.5, arrowGap: 12 },
};
