<script setup lang="ts">
import { EventCountryEntriesGrouped, EventCountryEntriesUngrouped } from "#components"

defineProps<{
  entries: EntryInterface[]
  status: APIStatusType
  tournament: TournamentInterface
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventCountryEntriesGrouped : EventCountryEntriesUngrouped"
    :key="tableMode"
    :entries
    :status
    :tournament
  />
</template>
