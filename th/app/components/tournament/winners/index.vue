<script setup lang="ts">
import { TournamentWinnersGrid, TournamentWinnersTable } from "#components"

const { viewMode } = useViewMode()
const { params } = useRoute()
const { id } = params as { id: string }

// API call
const { data: events, status } = await useFetch<TournamentWinnerEventType[]>("/api/tournaments/winners", {
  key: `tournament-winners-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'list' ? TournamentWinnersTable : TournamentWinnersGrid"
    :key="viewMode"
    :events
    :status
  />
</template>
