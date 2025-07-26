<script setup lang="ts">
const { events, status, value } = defineProps<{
  events: EventInterface[]
  status: APIStatusType
  value?: string
}>()
const { icons } = useAppConfig()
const { name, query } = useRoute()
const { viewMode } = useViewMode()

const message = computed(() => {
  switch (name) {
    case "category":
      return `No events of category ${value} found`
    case "venue":
      return `No events have taken place at ${value}`
    case "supervisor":
      return `No events supervised by ${value}`
    case "surface":
      return `No events have taken place on ${value}`
    case "upcoming-tournaments":
      return "No upcoming tournaments"
    case "results-archive":
      return `No events took place in ${query.year ?? new Date().getFullYear()}`
    default:
      return "No events found"
  }
})
</script>

<template>
  <u-page-grid
    v-if="events.length || status === 'pending'"
    class="xl:grid-cols-4 2xl:grid-cols-5 my-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth"
    :class="{ 'min-h-180 lg:min-h-150 xl:min-h-160 2xl:min-h-180': name === 'results-archive' && viewMode !== 'list' }"
  >
    <tournament-calendar-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :event
    />
    <loading-event
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noCalendar"
    :message
  />
</template>
