<script setup lang="ts">
import { EventEntryInfoTableGrouped, EventEntryInfoTableUngrouped } from "#components"

defineProps<{
  teams: EntryInfoInterface[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventEntryInfoTableGrouped : EventEntryInfoTableUngrouped"
    :teams
    :status
  />
</template>
