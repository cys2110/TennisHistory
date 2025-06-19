<script setup lang="ts">
import { EventDetailsGrid, EventDetailsTable } from "#components"
defineProps<{ tours: TourType[] }>()
const { viewMode } = useViewMode()
const { icons } = useAppConfig()
const {
  params: { eid }
} = useRoute()

// API call
const { data: event, status } = await useFetch<EventDetailsType>("/api/events/details", {
  query: { id: eid }
})
</script>

<template>
  <dashboard-subpanel
    title="Details"
    :icon="icons.overview"
  >
    <component
      :is="viewMode === 'list' ? EventDetailsTable : EventDetailsGrid"
      :key="viewMode"
      :event
      :status
      :tours
    />
  </dashboard-subpanel>
</template>
