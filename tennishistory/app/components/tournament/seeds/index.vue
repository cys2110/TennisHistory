<script setup lang="ts">
import { TournamentSeedsGrid, TournamentSeedsTable } from "#components"

const { viewMode } = useDefaults()
const { params } = useRoute()
const { id } = params as { id: string }

// API call
const { data: results, status } = await useFetch("/api/tournaments/seeds", {
  key: `tournament-seeds-${id}`,
  query: { id },
  default: () => []
})

const sortedResults = computed(() => {
  return results.value.sort((a, b) => a.year - b.year)
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentSeedsGrid : TournamentSeedsTable"
    :key="viewMode"
    :results="sortedResults"
    :status
  />
</template>
