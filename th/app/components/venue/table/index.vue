<script setup lang="ts">
const { tableMode } = useDefaultTable()
const letter = defineModel<string | undefined>()
</script>

<template>
  <venue-table-grouped
    v-if="tableMode === 'grouped'"
    v-model="letter"
  />
  <venue-table-ungrouped
    v-else
    v-model="letter"
  />
</template>
