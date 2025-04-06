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
    <u-page-card
      v-for="detail in eventDetails"
      :key="detail.id"
      :title="detail.title"
      spotlight
      variant="outline"
      :icon="detail.id === 'venues' ? `flag:${event.venues[0].country.alpha2}-4x3` : undefined"
    >
      <template #description>
        <div
          v-if="detail.id === 'supervisors'"
          class="flex flex-col"
        >
          <u-link
            v-if="event.supervisors.length > 0"
            v-for="supervisor in event.supervisors"
            :key="supervisor"
            :to="{ name: 'supervisor', params: { id: encodeName(supervisor) } }"
            >{{ supervisor }}</u-link
          >
          <template v-else>—</template>
        </div>
        <div v-else-if="detail.id === 'venues'">
          <div
            v-for="(venue, index) in event.venues"
            :key="index"
          >
            {{ venue.name }}, {{ venue.city }}
          </div>
        </div>
        <template v-else>{{ detail.value }}</template>
      </template>
    </u-page-card>
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noInfo"
    :title="`No details found for ${name} ${year}`"
    :status="status"
    :error="`Error fetching details for ${name} ${year}`"
  />
</template>
