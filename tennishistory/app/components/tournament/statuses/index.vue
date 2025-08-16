<script setup lang="ts">
import { TournamentStatusesGrid, TournamentStatusesTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: players, status } = await useFetch<EntryInterface[]>("/api/tournaments/statuses", {
  key: `tournament-statuses-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'list' ? TournamentStatusesTable : TournamentStatusesGrid"
    :key="viewMode"
    :players
    :status
  />
</template>
