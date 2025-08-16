<script setup lang="ts">
import { TournamentAlphabeticalGrid, TournamentAlphabeticalTable } from "#components"

useHead({ title: "Tournaments" })
const { viewMode } = useDefaults()
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'list' ? TournamentAlphabeticalTable : TournamentAlphabeticalGrid"
      :key="viewMode"
    />
  </div>
</template>
