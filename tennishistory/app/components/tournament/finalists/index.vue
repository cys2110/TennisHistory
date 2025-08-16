<script setup lang="ts">
import { TournamentFinalistsGrid, TournamentFinalistsTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistType[]>("/api/tournaments/finalists", {
  key: `tournament-finalists-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentFinalistsGrid : TournamentFinalistsTable"
    :key="viewMode"
    :finalists
    :status
  />
</template>
