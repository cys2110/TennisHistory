<script setup lang="ts">
import { CountryEntriesGrid, CountryEntriesTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: entries, status } = await useFetch<CountryEntryType[]>("/api/events/country-event-entries", {
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
      :is="viewMode === 'cards' ? CountryEntriesGrid : CountryEntriesTable"
      :key="viewMode"
      :entries
      :status
    />
  </dashboard-subpanel>
</template>
