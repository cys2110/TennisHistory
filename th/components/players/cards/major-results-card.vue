<script setup lang="ts">
defineProps<{ result: MajorResultsType }>()
</script>

<template>
  <u-page-card
    highlight
    :ui="{ description: 'flex flex-col gap-1' }"
  >
    <template #title>
      <base-link
        type="tournament"
        :tournament="result.tournament"
      />
      — {{ result.round }}
    </template>

    <template #description>
      <u-link
        v-for="event in result.events"
        :key="event.year"
        class="hover-link w-fit"
        :to="{ name: 'event', params: { id: result.tournament.id, name: encodeName(result.tournament.name), year: event.year, eid: event.id } }"
      >
        {{ event.year }}
      </u-link>
    </template>
  </u-page-card>
</template>
