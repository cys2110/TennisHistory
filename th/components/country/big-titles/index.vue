<script setup lang="ts">
import { CountryBigTitlesGrid, CountryBigTitlesTable } from "#components"

const { icons } = useAppConfig()
const route = useRoute()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: players, status } = await useFetch<{
  singles_players: CountryBigTitlesAPIResponseType[]
  doubles_players: CountryBigTitlesAPIResponseType[]
}>("/api/countries/big-titles", {
  query: { id: route.params.id },
  default: () => ({ singles_players: [], doubles_players: [] })
})
</script>

<template>
  <dashboard-subpanel
    :title="`Players who have won big titles representing ${name}`"
    :icon="icons.tournament"
    id="big-titles"
  >
    <component
      :is="viewMode === 'list' ? CountryBigTitlesTable : CountryBigTitlesGrid"
      :key="viewMode"
      :players
      :status
    />
  </dashboard-subpanel>
</template>
