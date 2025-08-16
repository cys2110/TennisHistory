<script setup lang="ts">
import { TournamentStatusesTableGrouped, TournamentStatusesTableUngrouped } from "#components"

defineProps<{
  players: EntryInterface[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? TournamentStatusesTableGrouped : TournamentStatusesTableUngrouped"
    :key="tableMode"
    :players
    :status
  />
</template>
