<script setup lang="ts">
defineProps<{ events: ArchiveEventType[] }>()
</script>

<template>
  <u-page-grid>
    <event-card
      v-for="event in events"
      :key="event.eid"
      :event="event"
      :id="`event-${event.eid}`"
    />
  </u-page-grid>
</template>
