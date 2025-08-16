<script setup lang="ts">
import { TournamentLowestRankGrid, TournamentLowestRankTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data, status } = await useFetch<TournamentLowestRankedType[]>("/api/tournaments/lowest-ranked", {
  key: `tournament-lowest-ranked-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'list' ? TournamentLowestRankTable : TournamentLowestRankGrid"
    :key="viewMode"
    :results="data"
    :status
  />
</template>
