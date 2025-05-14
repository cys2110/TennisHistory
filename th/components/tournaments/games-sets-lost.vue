<script setup lang="ts">
import { GamesSetsLostGrid, GamesSetsLostTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: scores, status } = await useFetch<GamesSetsLostInterface[]>("/api/tournaments/scores-stats", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching score stats for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Winners by Games and Sets Lost"
    :icon="ICONS.scores"
  >
    <template #right>
      <games-sets-lost-chart :scores />
    </template>

    <component
      :is="viewMode === 'cards' ? GamesSetsLostGrid : GamesSetsLostTable"
      :key="viewMode"
      :scores
      :status
    />
  </dashboard-subpanel>
</template>
