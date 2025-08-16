<script setup lang="ts">
import { TournamentAgeTableGrouped, TournamentAgeTableUngrouped } from "#components"

defineProps<{
  winners: TournamentAgeType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentAgeTableGrouped : TournamentAgeTableUngrouped"
    :key="tableMode"
    :winners
    :status
  />
</template>
