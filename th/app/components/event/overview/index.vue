<script setup lang="ts">
const { tours, tournament } = defineProps<{
  tours: TourType[]
  tournament: TournamentInterface
}>()
provide<TourType[]>("tours", tours)
provide<TournamentInterface>("tournament", tournament)
</script>

<template>
  <u-page-list class="*:my-5">
    <event-details />
    <event-awards />
    <event-seeds />
    <event-entry-info />
    <event-entries />
  </u-page-list>
</template>
