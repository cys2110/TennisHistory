<script setup lang="ts">
import { EventAwardsTableGrouped, EventAwardsTableUngrouped } from "#components"

const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const { tableMode } = useDefaultTable()
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? EventAwardsTableGrouped : EventAwardsTableUngrouped"
    :awards
    :status
  />
</template>
