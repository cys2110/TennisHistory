<script setup lang="ts">
import { EntriesGrid, EntriesTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: entries, status } = await useFetch<Omit<EntryInterface, "incomplete" | "rank2" | "reason">[]>("/api/events/entries", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching entries for ${name.value} ${route.params.year}`,
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
    title="Entries"
    :icon="ICONS.player"
  >
    <component
      :is="viewMode === 'cards' ? EntriesGrid : EntriesTable"
      :key="viewMode"
      :entries
      :status
    />
  </dashboard-subpanel>
</template>
