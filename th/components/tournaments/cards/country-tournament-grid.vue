<script setup lang="ts">
defineProps<{ events: CountryEventType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid v-if="events.length || ['pending', 'idle'].includes(status)">
    <country-event-card
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="event.id"
      :event
    />
    <event-loading-card
      v-else
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noTournament"
    :message="`No events found for ${name}`"
  />
</template>
