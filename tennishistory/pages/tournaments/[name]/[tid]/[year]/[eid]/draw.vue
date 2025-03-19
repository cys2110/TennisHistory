<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core"

definePageMeta({
  name: "draw",
  layout: "dashboard-layout"
})
const toast = useToast()
const formatName = useFormatName()
const { fitView } = useVueFlow()
const { layout } = useLayout()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")

// API call
const { data: nodes } = await useFetch("/api/event-draw", {
  query: { eid },
  transform(data: DrawMatchType[]) {
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
      title: `Error fetching draw for ${formatName.capitaliseName.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
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
  <event-wrapper>
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
  </event-wrapper>
</template>
