<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core"
definePageMeta({ name: "draw", layout: "event-layout" })

const eid = useRouteParams<string>("eid")
const toast = useToast()
const { layout } = useLayout()
const { fitView } = useVueFlow()

const { data: nodes } = await useFetch("/api/eventDraw", {
  query: { eid },
  transform(data: Pick<MatchType, "round" | "incomplete" | "winner_id" | "p1" | "p2" | "mid">[]) {
    return data.map(match => {
      return {
        id: match.mid,
        position: { x: 0, y: 0 },
        data: {
          label: match.mid,
          match
        },
        type: "draw-card"
      }
    })
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const edges = computed(() => {
  if (nodes.value) {
    return nodes.value
      .map((node, index) => {
        if (index > 0) {
          return {
            id: `${node.id}-${Math.floor(parseInt(node.id) / 2)}`,
            source: node.id,
            target: Math.floor(parseInt(node.id) / 2).toString(),
            type: "smoothstep"
          }
        }
        return null
      })
      .filter(edge => edge !== null)
  }
})

async function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value)

  nextTick(() => {
    fitView()
  })
}
</script>

<template>
  <u-container>
    <ClientOnly v-if="nodes">
      <div class="h-screen w-full overflow-x-auto">
        <VueFlow
          :nodes
          :edges
          @nodes-initialized="layoutGraph()"
        >
          <template #node-draw-card="props">
            <draw-card
              :id="props.id"
              :match="props.data.match"
            />
          </template>
        </VueFlow>
      </div>
    </ClientOnly>
    <error-message
      v-else
      :icon="ICONS.error"
      title="No draw available"
    />
  </u-container>
</template>
