<script setup lang="ts">
import { EventDetailsGrid, EventDetailsTable } from "#components"
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const { params } = useRoute()
const { eid } = params as { eid: string }

// API call
const { data: event, status } = await useFetch<EventInterface>("/api/events/details", {
  query: { id: eid }
})
</script>

<template>
  <dashboard-subpanel
    id="details"
    title="Details"
    :icon="icons.overview"
  >
    <component
      :is="viewMode === 'list' ? EventDetailsTable : EventDetailsGrid"
      :key="viewMode"
      :event
      :status
    />
  </dashboard-subpanel>
</template>
