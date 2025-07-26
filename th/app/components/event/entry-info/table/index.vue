<script setup lang="ts">
import { EventEntryInfoTableGrouped, EventEntryInfoTableUngrouped } from "#components"

const { data } = defineProps<{ data: EntryInfoType[]; status: APIStatusType }>()
const { tableMode } = useDefaultTable()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventEntryInfoTableGrouped : EventEntryInfoTableUngrouped"
    :data
    :status
  />
</template>
