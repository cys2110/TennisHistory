<script setup lang="ts">
import { TournamentPmGrid, TournamentPmTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: rounds, status } = await useFetch<TournamentPmType[]>("/api/tournaments/pm", {
  key: `tournament-pm-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentPmGrid : TournamentPmTable"
    :key="viewMode"
    :rounds
    :status
  />
</template>
