<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core"
definePageMeta({
  name: "draw",
  middleware: [
    function (to, from) {
      if (COUNTRY_DRAWS.includes(to.params.id as string)) {
        return navigateTo({ name: "country-draw" })
      } else if (to.params.id === "9210") {
        return navigateTo({ name: "laver-cup-draw" })
      }
    }
  ]
})

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { fitView } = useVueFlow()
const { layout } = useLayout()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: nodes, status } = await useFetch("/api/events/draw", {
  query: { eid: route.params.eid },
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
  <div>
    <nuxt-layout name="event-layout">
      <div
        v-if="nodes"
        class="h-screen w-full overflow-x-auto"
      >
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
      <error-message
        v-else
        :title="`No draw available for ${name} ${route.params.year}`"
      />
    </nuxt-layout>
  </div>
</template>
