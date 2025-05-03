<script setup lang="ts">
defineProps<{
  events: EventCardType[]
  status: "success" | "pending" | "idle" | "error"
  year: string
}>()

const route = useRoute()
</script>

<template>
  <!--If no events are returned-->
  <error-message
    v-if="status === 'error' || !events.length"
    :title="
      route.name === 'upcoming-tournaments'
        ? 'No upcoming tournaments'
        : `No tournaments for ${year}`
    "
    :icon="ICONS.noCalendar"
  />

  <u-page-grid v-else>
    <!--Event cards-->
    <event-card
      v-if="status === 'success'"
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
</template>
