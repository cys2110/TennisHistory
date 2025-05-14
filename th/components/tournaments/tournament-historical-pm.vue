<script setup lang="ts">
import { TournamentHistoricalPmGrid, TournamentHistoricalPmTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: pm, status } = await useFetch<HistoricalPMInterface[]>("/api/tournaments/historical-pm", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching prize money for ${name.value}`,
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
    title="Historical Prize Money"
    :icon="ICONS.awards"
  >
    <template #right>
      <tournament-historical-pm-chart :pm />
    </template>

    <component
      :is="viewMode === 'cards' ? TournamentHistoricalPmGrid : TournamentHistoricalPmTable"
      :key="viewMode"
      :pm
      :status
    />
  </dashboard-subpanel>
</template>
