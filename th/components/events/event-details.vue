<script setup lang="ts">
import { EventDetailsGrid, EventDetailsTable } from "#components"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))

type EventDetailsType = Pick<EventInterface, "name" | "category" | "surface" | "venues" | "dates" | "tfc" | "pm" | "currency" | "supervisors">

// API call
const { data: event, status } = await useFetch<EventDetailsType>("/api/events/details", {
  query: { id: route.params.eid },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const eventDetails = computed(() => {
  if (event.value) {
    return [
      { id: "name", title: "Sponsor Name", value: event.value.name ?? "—" },
      { id: "category", title: "Category", value: event.value.category ?? "—" },
      { id: "dates", title: "Dates", value: event.value.dates },
      { id: "surface", title: "Surface", value: event.value.surface },
      {
        id: "venues",
        title: event.value.venues.length === 1 ? "Venue" : "Venues",
        value: event.value.venues
      },
      {
        id: "supervisors",
        title: event.value.supervisors.length === 1 ? "Supervisor" : "Supervisors",
        value: event.value.supervisors
      },
      {
        id: "pm",
        title: "Prize Money",
        value: event.value.currency && event.value.pm ? `${CURRENCIES[event.value.currency]}${event.value.pm}` : "—"
      },
      {
        id: "tfc",
        title: "Total Financial Commitment",
        value: event.value.currency && event.value.tfc ? `${CURRENCIES[event.value.currency]}${event.value.tfc}` : "—"
      }
    ]
  }
  return []
})
</script>

<template>
  <dashboard-subpanel
    title="Details"
    :icon="ICONS.overview"
  >
    <component
      :is="viewMode === 'cards' ? EventDetailsGrid : EventDetailsTable"
      :key="viewMode"
      :event-details
      :status
    />
  </dashboard-subpanel>
</template>
