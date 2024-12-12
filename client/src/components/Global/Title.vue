<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tournamentPages = ['tournament', 'event', 'draw', 'results', 'match']
const playerPages = ['player', 'activity', 'titles', 'index', 'stats']
</script>

<template>
  <TournamentBreadcrumbs v-if="tournamentPages.includes(route.name as string)" />
  <PlayerBreadcrumbs v-if="playerPages.includes(route.name as string)" />
  <div class="flex flex-col md:flex-row mb-12 md:justify-between md:items-center">
    <div class="text-zinc-300 text-3xl md:text-4xl xl:text-5xl">
      <slot name="title" />
    </div>
    <div class="text-zinc-400 md:ml-10 text-xl md:text-2xl xl:text-3xl">
      <slot name="subtitle" />
    </div>
  </div>
</template>