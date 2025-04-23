<script setup lang="ts">
defineProps<{ events: CountryEventType[] }>()
</script>

<template>
  <u-page-grid>
    <country-event-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
</template>
