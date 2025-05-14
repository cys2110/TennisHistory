<script setup lang="ts">
import { TournamentFinalistsGrid, TournamentFinalistsTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistsInterface[]>("/api/tournaments/finalists", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching finalists for ${name.value}`,
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
    title="Players by No. of Finals"
    :icon="ICONS.tournament"
  >
    <template #right>
      <tournament-finalists-chart :finalists />
    </template>

    <component
      :is="viewMode === 'cards' ? TournamentFinalistsGrid : TournamentFinalistsTable"
      :key="viewMode"
      :finalists
      :status
    />
  </dashboard-subpanel>
</template>
