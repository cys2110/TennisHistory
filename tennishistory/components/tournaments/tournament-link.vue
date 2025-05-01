<script setup lang="ts">
defineProps<{ tournament: Pick<TournamentInterface, "name" | "id"> }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'tournament', params: { name: encodeName(tournament.name), id: tournament.id } }"
  >
    {{ tournament.name }}
  </u-link>
</template>
