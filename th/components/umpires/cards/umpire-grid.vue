<script setup lang="ts">
type EventType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year" | "surface" | "category" | "venues" | "dates"> & {
  rounds: {
    round: RoundType
    matches: Pick<MatchInterface, "match_no" | "p1" | "p2">[]
  }[]
}

const { events, count, status } = defineProps<{
  events: EventType[]
  status: APIStatusType
  count: number
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.id as string))
const skip = defineModel<number>({ default: 0 })

const grid = useTemplateRef<ComponentPublicInstance>("grid")

onMounted(async () => {
  useInfiniteScroll(
    grid.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 90,
      canLoadMore: () => status !== "pending" && events.length < count
    }
  )
})
</script>

<template>
  <u-page-columns
    v-if="events.length || ['pending', 'idle'].includes(status)"
    class="lg:columns-2 xl:columns-2 2xl:columns-4"
  >
    <umpire-event-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="`event-${event.id}`"
      :event
    />
    <umpire-event-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>

  <error-message
    v-else
    :message="`No matches umpired by ${name}`"
  />
</template>
