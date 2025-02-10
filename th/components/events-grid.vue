<script setup lang="ts">
defineProps<{ events: EventCard[] }>()
</script>

<template>
  <u-page-grid>
    <event-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
</template>
