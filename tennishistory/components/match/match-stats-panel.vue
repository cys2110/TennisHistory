<script setup lang="ts">
defineProps<{ stats: MatchStatsType[]; p1_name: string; p2_name: string; p1_id: string; p2_id: string }>()
const checked = ref(false)
</script>

<template>
  <u-container>
    <u-switch
      v-model="checked"
      :checked-icon="ICONS['bar-chart']"
      :unchecked-icon="ICONS['table']"
    />
    <match-stats-chart
      v-if="checked"
      :stats="stats"
      :p1_name="p1_name"
      :p2_name="p2_name"
    />
    <match-stats-table
      v-else
      :stats="stats"
      :p1_name="p1_name"
      :p2_name="p2_name"
      :p1_id
      :p2_id
    />
  </u-container>
</template>
