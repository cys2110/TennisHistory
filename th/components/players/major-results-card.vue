<script setup lang="ts">
defineProps<{ result: MajorResultsInterface }>()
</script>

<template>
  <u-page-card
    highlight
    :ui="{ description: 'flex flex-col gap-1' }"
  >
    <template #title>
      <tournament-link
        :name="result.name"
        :id="result.tid"
      />
      — {{ result.round }}
    </template>

    <template #description>
      <event-link
        v-for="event in result.events"
        :key="event.year"
        :name="result.name"
        :tid="result.tid"
        :eid="event.eid"
        :year="event.year"
      >
        {{ event.year }}
      </event-link>
    </template>
  </u-page-card>
</template>
