<script setup lang="ts">
defineProps<{ stats: PlayerStatsInterface }>()
</script>

<template>
  <u-page-card
    :title="stats.category"
    :description="stats.value"
    spotlight
    variant="outline"
    :ui="{ description: 'text-center', wrapper: 'items-center' }"
  />
</template>
