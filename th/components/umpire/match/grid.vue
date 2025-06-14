<script setup lang="ts">
const { events, status } = defineProps<{
  events: APIUmpireEventType[]
  status: APIStatusType
}>()
const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
</script>

<template>
  <u-page-columns
    v-if="events.length || ['pending', 'idle'].includes(status)"
    class="lg:columns-2 xl:columns-2 2xl:columns-3 max-h-200 overflow-y-auto p-4"
  >
    <umpire-match-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="`event-${event.id}`"
      :event
    />
    <loading-event
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
