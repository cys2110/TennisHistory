<script setup lang="ts">
import { TournamentScoresStatsTableGrouped, TournamentScoresStatsTableUngrouped } from "#components"

defineProps<{
  winners: TournamentScoreStatsType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentScoresStatsTableGrouped : TournamentScoresStatsTableUngrouped"
    :key="tableMode"
    :winners
    :status
  />
</template>
