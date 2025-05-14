<script setup lang="ts">
const { events, status, value, count } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value?: string
  count: number
}>()

const route = useRoute()
const skip = defineModel<number>({ default: 0 })

const grid = useTemplateRef<ComponentPublicInstance>("grid")

onMounted(async () => {
  useInfiniteScroll(
    grid.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && events.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="events.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-200 overflow-y-auto p-4"
  >
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
        ? `No events took place on ${value}`
        : route?.name === 'supervisor'
        ? `No events supervised by ${value}`
        : route?.name === 'upcoming-tournaments'
        ? 'No upcoming tournaments'
        : route?.name === 'archive-results'
        ? `No tournaments in ${value}`
        : route?.name === 'venue'
        ? `No events took place at ${value}`
        : route?.name === 'category'
        ? `No events found for category ${value}`
        : 'No events found'
    "
  />
</template>
