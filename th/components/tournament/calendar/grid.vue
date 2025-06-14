<script setup lang="ts">
const { events, status, value } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value?: string
}>()
const { icons } = useAppConfig()
const { name, query } = useRoute()
</script>

<template>
  <u-page-grid
    v-if="events.length || ['pending', 'idle'].includes(status)"
    class="py-5"
  >
    <tournament-calendar-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :event
      :value
    />

    <loading-event
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="
      name === 'upcoming-tournaments' ? 'No upcoming tournaments'
      : name === 'category' ? `No events of category ${value} in ${query.year}`
      : name === 'surface' ? `No events took place on ${value} in ${query.year}`
      : `No events in ${query.year}`
    "
    :icon="icons.noCalendar"
  />
</template>
