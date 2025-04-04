<script setup lang="ts">
defineProps<{ events: TournamentEventType[] }>()
const paramName = useRouteParams<string>("name")
</script>

<template>
  <u-page-grid>
    <tournament-card
      v-for="event in events"
      :key="event.eid"
      :event
    />
  </u-page-grid>
</template>
