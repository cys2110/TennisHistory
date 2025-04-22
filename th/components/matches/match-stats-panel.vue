<script setup lang="ts">
defineProps<{
  stats: { key?: string; label: string; percent?: boolean; value: number[] }[]
  title: string
  checked: boolean
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()
</script>

<template>
  <dashboard-subpanel :title>
    <match-stats-chart
      v-if="checked"
      :stats
      :p1
      :p2
    />

    <match-stats-table
      v-else
      :stats
      :p1
      :p2
    />
  </dashboard-subpanel>
</template>
