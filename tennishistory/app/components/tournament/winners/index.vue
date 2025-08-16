<script setup lang="ts">
import { TournamentWinnersGrid, TournamentWinnersTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: events, status } = await useFetch<TournamentWinnerEventType[]>("/api/tournaments/winners", {
  key: `tournament-winners-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'list' && mdAndUp ? TournamentWinnersTable : TournamentWinnersGrid"
    :key="viewMode"
    :events
    :status
  />
</template>
