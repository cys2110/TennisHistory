<script setup lang="ts">
defineProps<{
  id: string
  tournament: Pick<TournamentInterface, "id" | "name">
  year: string
  match_no: string
}>()
</script>

<template>
  <u-link
    class="flex justify-between items-center text-sm hover-link w-fit"
    :to="{
      name: 'match',
      params: { name: encodeName(tournament.name), id: tournament.id, eid: id, year, mid: match_no }
    }"
  >
    <slot />
  </u-link>
</template>
