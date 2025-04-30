<script setup lang="ts">
defineProps<{ result: MajorResultsType }>()
</script>

<template>
  <u-page-card
    highlight
    :ui="{ description: 'flex flex-col gap-1' }"
  >
    <template #title>
      <tournament-link :tournament="result.tournament" />
      — {{ result.round }}
    </template>

    <template #description>
      <event-link
        v-for="event in result.events"
        :key="event.year"
        :tournament="result.tournament"
        :id="event.id"
        :year="event.year"
      >
        {{ event.year }}
      </event-link>
    </template>
  </u-page-card>
</template>
