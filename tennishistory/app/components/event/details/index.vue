<script setup lang="ts">
import { EventDetailsGrid } from "#components"

const {
  params: { eid }
} = useRoute()
const { icons } = useAppConfig()

// API call
const { data: event, status } = await useFetch<EventInterface>("/api/events/details", {
  key: `event-details-${eid}`,
  query: { id: eid }
})
</script>

<template>
  <dashboard-subpanel
    title="Details"
    :icon="icons.overview"
  >
    <event-details-grid
      :event
      :status
    />
  </dashboard-subpanel>
</template>
