<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

// API call
const { data: event, status } = await useFetch<CountryEventDetailsType>("/api/country-event-details", { query: { eid } })

const eventDetails = computed(() => {
  if (event.value) {
    return [
      { id: "dates", title: "Dates", value: event.value.dates },
      { id: "surface", title: "Surface", value: event.value.surface },
      { id: "venues", title: event.value.venues.length === 1 ? "Venue" : "Venues", value: event.value.venues },
      { id: "supervisors", title: event.value.supervisors.length === 1 ? "Supervisor" : "Supervisors", value: event.value.supervisors },
      { id: "tfc", title: "Total Financial Commitment", value: event.value.currency && event.value.tfc ? `${CURRENCIES[event.value.currency]}${event.value.tfc}` : "—" }
    ]
  }
})
</script>

<template>
  <u-page-grid v-if="event">
    <details-card
      v-for="detail in eventDetails"
      :key="detail.id"
      :detail
    />
  </u-page-grid>
  <u-page-grid v-else-if="status === 'pending'">
    <details-loading-card
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :title="`No details found for ${name} ${year}`"
    :status="status"
    :error="`Error fetching details for ${name} ${year}`"
  />
</template>
