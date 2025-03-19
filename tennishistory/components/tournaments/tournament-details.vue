<script setup lang="ts">
const formatName = useFormatName()
const toast = useToast()
const tid = useRouteParams<string>("tid")

// API call
const { data: events } = await useFetch<TournamentEventType[]>("/api/tournament-details", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${formatName.capitaliseName.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <u-page-grid v-if="events && events.length > 0">
    <tournament-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS['no-trophy']"
    :title="`No events found for ${formatName.capitaliseName.value}`"
  />
</template>
