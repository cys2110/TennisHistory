<script setup lang="ts">
import { EventSeedsTableGrouped, EventSeedsTableUngrouped } from "#components"

defineProps<{ seeds: SeedInterface[]; status: APIStatusType; tournament: string }>()
const { tableMode } = useDefaultTable()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventSeedsTableGrouped : EventSeedsTableUngrouped"
    :seeds
    :status
    :tournament
  />
</template>
