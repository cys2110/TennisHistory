<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const formatName = useFormatName()
const toast = useToast()

// API call
const { data: event } = await useFetch<EventDetailsType>("/api/event-details", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${formatName.capitaliseName.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

const eventDetails = computed(() => {
  if (event.value) {
    return [
      { id: "name", title: "Sponsor Name", value: event.value.ename ?? "—" },
      { id: "category", title: "Category", value: event.value.category ?? "—" },
      { id: "dates", title: "Dates", value: event.value.dates },
      { id: "surface", title: "Surface", value: event.value.surface },
      { id: "venues", title: event.value.venues.length === 1 ? "Venue" : "Venues", value: event.value.venues },
      { id: "supervisors", title: event.value.supervisors.length === 1 ? "Supervisor" : "Supervisors", value: event.value.supervisors },
      { id: "pm", title: "Prize Money", value: event.value.currency && event.value.pm ? `${CURRENCIES[event.value.currency]}${event.value.pm}` : "—" },
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
    >
      <template #description>
        <div v-if="detail.id === 'supervisors'">
          <template v-if="event.supervisors.length > 0">{{ event.supervisors.join(" | ") }}</template>
          <template v-else>—</template>
        </div>
        <div v-else-if="detail.id === 'venues'">
          <div
            v-for="(venue, index) in event.venues"
            :key="index"
          >
            {{ venue.name }}, {{ venue.city }} <flag-icon :country="venue.country" />
          </div>
        </div>
        <template v-else>{{ detail.value }}</template>
      </template>
    </u-page-card>
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No details found for ${formatName.capitaliseName.value} ${year}`"
  />
</template>
