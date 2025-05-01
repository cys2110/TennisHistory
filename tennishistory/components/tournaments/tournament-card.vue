<script setup lang="ts">
defineProps<{ tournament: Pick<TournamentInterface, "id" | "name" | "years"> }>()
</script>

<template>
  <u-page-card
    :title="tournament.name"
    :description="tournament.years"
    :to="{
      name: COUNTRY_DRAWS.includes(tournament.id) ? 'country-tournament' : 'tournament',
      params: { name: encodeName(tournament.name), id: tournament.id }
    }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
