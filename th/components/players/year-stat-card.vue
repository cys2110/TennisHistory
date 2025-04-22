<script setup lang="ts">
defineProps<{ stats: PlayerStatsInterface }>()
</script>

<template>
  <u-page-card
    :title="stats.category"
    :description="stats.value.toString()"
    spotlight
    variant="outline"
    :ui="{ description: 'text-center text-3xl', wrapper: 'items-center', title: 'text-center' }"
  />
</template>
