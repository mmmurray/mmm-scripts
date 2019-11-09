type Node = string
type Edge = [Node, Node]

// Kahn's algorithm https://en.wikipedia.org/wiki/Topological_sorting
const topologicalSort = (_edges: Edge[]): Node[] => {
  const edges = [..._edges]
  const sortedNodes: string[] = []
  const allNodes = edges
    .reduce<Node[]>((acc, [a, b]) => [...acc, a, b], [])
    .filter((a, i, arr) => arr.indexOf(a) === i)

  const nodes = Array.from(allNodes.values()).filter(node =>
    edges.every(([, b]) => b !== node),
  )

  while (nodes.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const n = nodes.shift()!
    sortedNodes.unshift(n)

    edges
      .filter(([a]) => a === n)
      .forEach(edge => {
        edges.splice(edges.indexOf(edge), 1)

        const [, m] = edge
        if (!edges.some(([, b]) => b === m) && !nodes.includes(m)) {
          nodes.push(m)
        }
      })
  }

  return sortedNodes
}

export { topologicalSort }
