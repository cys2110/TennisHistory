<script setup lang="ts">
import { MajorResultsGrid, MajorResultsTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: results, status } = await useFetch<MajorResultsType[]>("/api/players/major-results", {
  query: { id: route.params.id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s best results`,
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
    title="Best Results"
    :icon="ICONS.seeds"
  >
    <component
      :is="viewMode === 'cards' ? MajorResultsGrid : MajorResultsTable"
      :key="viewMode"
      :results
      :status
    />
  </dashboard-subpanel>
</template>
