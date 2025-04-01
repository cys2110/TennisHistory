import dagre from "@dagrejs/dagre"
import { Position, useVueFlow } from "@vue-flow/core"

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
  const { findNode } = useVueFlow()

  const graph = ref(new dagre.graphlib.Graph())

  function layout(nodes: any, edges: any) {
    graph.value.setDefaultEdgeLabel(() => ({}))

    graph.value.setGraph({ rankdir: "LR" })

    for (const node of nodes) {
      const graphNode = findNode(node.id)

      graph.value.setNode(node.id, { width: graphNode?.dimensions.width || 150, height: graphNode?.dimensions.height || 50 })
    }

    for (const edge of edges) {
      graph.value.setEdge(edge.source, edge.target)
    }

    dagre.layout(graph.value)

    return nodes.map((node: any) => {
      const nodeWithPosition = graph.value.node(node.id)

      return {
        ...node,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: { x: nodeWithPosition.x, y: nodeWithPosition.y }
      }
    })
  }

  return { graph, layout }
}
