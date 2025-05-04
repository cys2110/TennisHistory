<script setup lang="ts">
const { events, status, value } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value?: string
}>()

const route = useRoute()
</script>

<template>
  <!--If no events are returned-->
  <error-message
    v-if="status === 'error' || !events.length"
    :icon="ICONS.noCalendar"
    :message="route?.name === 'surface' ? `No events found on ${value}` : 'test'"
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
