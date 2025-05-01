<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

type EventDetailsType = Pick<
  EventInterface,
  "surface" | "venues" | "dates" | "tfc" | "currency" | "supervisors"
>

// API call
const { data: event, status } = await useFetch<EventDetailsType>(
  "/api/events/country-event-details",
  {
    query: { eid: route.params.eid },
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching details for ${name.value}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

const eventDetails = computed(() => {
  if (event.value) {
    return [
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
        id: "tfc",
        title: "Total Financial Commitment",
        value:
          event.value.currency && event.value.tfc
            ? `${CURRENCIES[event.value.currency]}${event.value.tfc}`
            : "—"
      }
    ]
  }
})
</script>

<template>
  <u-page-grid v-if="event || ['pending', 'idle'].includes(status)">
    <details-card
      v-if="event"
      v-for="detail in eventDetails"
      :key="detail.id"
      :detail
    />

    <details-loading-card
      v-else
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :title="`No details found for ${name} ${route.params.year}`"
  />
</template>
