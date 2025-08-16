<script setup lang="ts">
import { TournamentScoresStatsGrid, TournamentScoresStatsTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: winners, status } = await useFetch<TournamentScoreStatsType[]>("/api/tournaments/scores-stats", {
  key: `tournament-scores-stats-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentScoresStatsGrid : TournamentScoresStatsTable"
    :key="viewMode"
    :winners
    :status
  />
</template>
