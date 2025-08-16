<script setup lang="ts">
import { EventSeedsTableGrouped, EventSeedsTableUngrouped } from "#components"

defineProps<{
  seeds: SeedInterface[]
  status: APIStatusType
}>()
const { tableMode } = useDefaults()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventSeedsTableGrouped : EventSeedsTableUngrouped"
    :seeds
    :status
  />
</template>
