<script setup lang="ts">
import { TournamentWinnersGrid, TournamentWinnersTable } from "#components"

const { viewMode } = useViewMode()
const { params } = useRoute()

// API call
const { data: events, status } = await useFetch<TournamentWinnerType[]>("/api/tournaments/winners", {
  query: { id: params.id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentWinnersGrid : TournamentWinnersTable"
    :key="viewMode"
    :events
    :status
  />
</template>
