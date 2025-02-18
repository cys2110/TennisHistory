<script setup lang="ts">
import dagre from "@dagrejs/dagre"
import { useVueFlow } from "@vue-flow/core"
definePageMeta({ name: "draw" })

const graph = ref(new dagre.graphlib.Graph())
const { findNode } = useVueFlow()

// @ts-ignore
const layout = (nodes, edges) => {
  for (const node of nodes) {
    const graphNode = findNode(node.id)
  }
}

const nodes = ref([
  {
    id: "final",
    position: { x: 1000, y: 50 },
    label: "Final",
    sourcePosition: "left",
    targetPosition: "left"
  },
  {
    id: "f",
    position: { x: 1000, y: 300 },
    label: "Final match",
    sourcePosition: "left",
    targetPosition: "left"
  },
  {
    id: "semifinals",
    position: { x: 600, y: 50 },
    label: "Semifinals",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "sf1",
    position: { x: 600, y: 150 },
    label: "Semifinal 1",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "sf2",
    position: { x: 600, y: 450 },
    label: "Semifinal 2",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "quarterfinals",
    position: { x: 200, y: 50 },
    label: "Quarterfinals",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "qf1",
    position: { x: 200, y: 100 },
    label: "Quarterfinal 1",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "qf2",
    position: { x: 200, y: 250 },
    label: "Quarterfinal 2",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "qf3",
    position: { x: 200, y: 350 },
    label: "Quarterfinal 3",
    sourcePosition: "right",
    targetPosition: "left"
  },
  {
    id: "qf4",
    position: { x: 200, y: 550 },
    label: "Quarterfinal 4",
    sourcePosition: "right",
    targetPosition: "left"
  }
])

const edges = ref([
  { id: "sf1-f", source: "sf1", target: "f", type: "smoothstep" },
  { id: "sf2-f", source: "sf2", target: "f", type: "smoothstep" },
  { id: "qf1-sf1", source: "qf1", target: "sf1", type: "smoothstep" },
  { id: "qf2-sf1", source: "qf2", target: "sf1", type: "smoothstep" },
  { id: "qf3-sf2", source: "qf3", target: "sf2", type: "smoothstep" },
  { id: "qf4-sf2", source: "qf4", target: "sf2", type: "smoothstep" }
])
</script>

<template>
  <div class="h-screen">
    <VueFlow
      :nodes
      :edges
    />
  </div>
</template>
