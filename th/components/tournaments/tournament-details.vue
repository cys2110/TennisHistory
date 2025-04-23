<script setup lang="ts">
defineProps<{ events: TournamentEventType[] }>()
</script>

<template>
  <u-page-grid>
    <tournament-event-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
</template>
