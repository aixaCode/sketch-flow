export function layoutManual(nodes) {
  return nodes.map((node) => Object.freeze({
    ...node,
    center: Object.freeze({
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    }),
  }));
}
