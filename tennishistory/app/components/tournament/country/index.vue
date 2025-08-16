<script setup lang="ts">
import { TournamentCountryGrid, TournamentCountryTable } from "#components"

const { viewMode } = useDefaults()
const {
  params: { id }
} = useRoute()

// API call
const { data: countries, status } = await useFetch<TournamentCountryType[]>("/api/tournaments/country-winners", {
  key: `tournament-country-${id}`,
  query: { id },
  default: () => []
})
</script>

<template>
  <component
    :is="viewMode === 'cards' ? TournamentCountryGrid : TournamentCountryTable"
    :key="viewMode"
    :countries
    :status
  />
</template>
