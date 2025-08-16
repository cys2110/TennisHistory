<script setup lang="ts">
import { EventCountryDetailsGrid, EventCountryEntriesGrid, EventCountryEntriesTable } from "#components"

defineProps<{ tournament: TournamentInterface }>()

const { viewMode } = useDefaults()
const {
  params: { eid }
} = useRoute()
const { icons } = useAppConfig()

// API calls
const { data: event, status: detailsStatus } = await useFetch<EventInterface>("/api/events/country-details", {
  key: `event-country-details-${eid}`,
  query: { id: eid }
})

const { data: entries, status: entriesStatus } = await useFetch<EntryInterface[]>("/api/events/country-entries", {
  key: `event-country-entries-${eid}`,
  query: { id: eid },
  default: () => []
})
</script>

<template>
  <div>
    <event-country-details-grid
      :tournament
      :event
      :status="detailsStatus"
    />

    <dashboard-subpanel
      title="Entries"
      :icon="icons.people"
    >
      <component
        :is="viewMode === 'list' ? EventCountryEntriesTable : EventCountryEntriesGrid"
        :key="`entries-${viewMode}`"
        :tournament
        :entries
        :status="entriesStatus"
      />
    </dashboard-subpanel>
  </div>
</template>
