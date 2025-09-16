<script setup lang="ts">
defineProps<{
  events: UmpireAPIType[]
  status: APIStatusType
  first_name?: string
  last_name?: string
}>()
</script>

<template>
  <u-page-columns
    v-if="events.length || status === 'pending'"
    class="md:columns-1 lg:columns-2 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 scroll-smooth"
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
    :message="`No matches umpired by ${first_name} ${last_name}`"
  />
</template>
