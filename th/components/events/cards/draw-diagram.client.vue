<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core"
import { MiniMap } from "@vue-flow/minimap"
import { Controls } from "@vue-flow/controls"
import "@vue-flow/minimap/dist/style.css"
import "@vue-flow/controls/dist/style.css"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const colorMode = useColorMode()
const { fitView } = useVueFlow()
const { layout } = useLayout()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: nodes, status } = await useFetch("/api/events/draw", {
  query: { id: route.params.eid },
  transform(data: DrawMatchType[]) {
    return data.map(match => {
      return {
        id: match.match_no,
        position: { x: 0, y: 0 },
        data: {
          label: match.match_no,
          match
        },
        type: "draw-card"
      }
    })
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching draw for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
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
  <div
    v-if="nodes"
    class="h-200 w-full overflow-x-auto"
  >
    <VueFlow
      :nodes
      :edges
      @nodes-initialized="layoutGraph()"
    >
      <MiniMap
        pannable
        zoomable
        node-color="#7c3aed"
        :mask-color="colorMode.value === 'dark' ? '#1e293b' : '#e2e8f0'"
      />
      <Controls>
        <template #icon-zoom-in>
          <u-icon
            :name="ICONS.zoomIn"
            class="bg-slate-600"
          />
        </template>

        <template #icon-zoom-out>
          <u-icon
            :name="ICONS.zoomOut"
            class="bg-slate-600"
          />
        </template>
      </Controls>
      <template #node-draw-card="props">
        <draw-card
          :id="props.id"
          :match="props.data.match"
        />
      </template>
    </VueFlow>
  </div>
  <error-message
    v-else
    :message="`No draw available for ${name} ${route.params.year}`"
  />
</template>
