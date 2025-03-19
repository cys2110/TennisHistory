<script setup lang="ts">
const tid = useRouteParams<string>("tid")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: events } = await useFetch<CountryEventType[]>("/api/country-tournament-details", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching events for ${formatName.capitaliseName.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <u-page-grid v-if="events && events.length > 0">
    <country-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS['no-calendar']"
    :title="`No events found for ${formatName.capitaliseName.value}`"
  />
</template>
