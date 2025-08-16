<script setup lang="ts">
import { TournamentAgeGrid, TournamentAgeTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: winners, status } = await useFetch<TournamentAgeType[]>("/api/tournaments/winners-by-age", {
  key: `tournament-age-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentAgeGrid : TournamentAgeTable"
    :key="viewMode"
    :winners
    :status
  />
</template>
