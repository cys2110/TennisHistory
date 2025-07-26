<script setup lang="ts">
const { tableMode } = useDefaultTable()
const letter = defineModel<string | undefined>()
</script>

<template>
  <player-table-grouped
    v-if="tableMode === 'grouped'"
    v-model="letter"
  />
  <player-table-ungrouped
    v-else
    v-model="letter"
  />
</template>
