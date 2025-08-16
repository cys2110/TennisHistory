<script setup lang="ts">
import { TournamentAlphabeticalTableGrouped, TournamentAlphabeticalTableUngrouped } from "#components"

const { tableMode } = useDefaults()

// API call
const { data: tournaments, status } = await useFetch<TournamentInterface[]>("/api/tournaments/table", {
  key: `tournaments`,
  default: () => []
})
</script>

<template>
  <page-wrapper>
    <component
      :is="tableMode === 'grouped' ? TournamentAlphabeticalTableGrouped : TournamentAlphabeticalTableUngrouped"
      :key="tableMode"
      :tournaments
      :status
    />
  </page-wrapper>
</template>
