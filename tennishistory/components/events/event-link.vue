<script setup lang="ts">
defineProps<{ tournament: Pick<TournamentInterface, "name" | "id">; id: string; year: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{
      name: 'event',
      params: { name: encodeName(tournament.name), eid: id, id: tournament.id, year }
    }"
  >
    <slot />
  </u-link>
</template>
