<script setup lang="ts">
const { events, status, value, error } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value?: string
}>()

const route = useRoute()
</script>

<template>
  <u-page-grid v-if="events.length || ['pending', 'idle'].includes(status)">
    <!--Event cards-->
    <event-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :event
      :id="`event-${event.id}`"
    />
    <!--Loading state-->
    <event-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>

  <!--If no events are returned-->
  <error-message
    v-else
    :icon="ICONS.noCalendar"
    :message="
      route?.name === 'surface'
        ? `No events found on ${value}`
        : route?.name === 'supervisor'
        ? `No events supervised by ${value}`
        : route?.name === 'upcoming-tournaments'
        ? 'No upcoming tournaments'
        : route.name === 'archive-results'
        ? `No tournaments in ${value}`
        : 'No events found'
    "
  />
</template>
