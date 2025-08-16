<script setup lang="ts">
import { TournamentLowestRankTableGrouped, TournamentLowestRankTableUngrouped } from "#components"

const { results } = defineProps<{
  results: TournamentLowestRankedType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()

const flattenedResults = computed(() => {
  const newResults: TournamentFlattenedLowestRankedType[] = []
  results.forEach(result => {
    result.players.forEach(player => {
      newResults.push({
        ...result,
        year: player.year,
        id: player.eid,
        player: {
          id: player.id,
          first_name: player.first_name,
          last_name: player.last_name,
          country: player.country,
          tour: result.tour
        }
      })
    })
  })
  return newResults
})
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentLowestRankTableGrouped : TournamentLowestRankTableUngrouped"
    :key="tableMode"
    :results="flattenedResults"
    :status
  />
</template>
