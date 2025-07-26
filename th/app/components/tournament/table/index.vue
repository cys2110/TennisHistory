<script setup lang="ts">
const { tableMode } = useDefaultTable()
const letter = defineModel<string | undefined>()
</script>

<template>
  <tournament-table-grouped
    v-if="tableMode === 'grouped'"
    v-model="letter"
  />
  <tournament-table-ungrouped
    v-else
    v-model="letter"
  />
</template>
