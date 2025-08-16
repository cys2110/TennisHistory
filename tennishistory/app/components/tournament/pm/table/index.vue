<script setup lang="ts">
import { TournamentPmTableGrouped, TournamentPmTableUngrouped } from "#components"

defineProps<{
  rounds: TournamentPmType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentPmTableGrouped : TournamentPmTableUngrouped"
    :key="tableMode"
    :rounds="rounds"
    :status="status"
  />
</template>
