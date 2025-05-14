<script setup lang="ts">
import { WlIndexGrid, WlIndexTable } from "#components"

definePageMeta({ name: "wl-index", layout: false })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: index, status } = await useFetch<WLIndexInterface[]>("/api/players/wl-index", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching win-loss index for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player">
      <template #toolbar>
        <wl-index-chart
          v-if="mdAndUp"
          :index
          class="ml-auto"
        />
      </template>

      <component
        :is="viewMode === 'cards' ? WlIndexGrid : WlIndexTable"
        :key="viewMode"
        :index
        :status
      />
    </nuxt-layout>
  </div>
</template>
