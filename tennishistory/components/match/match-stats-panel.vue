<script setup lang="ts">
defineProps<{ stats: MatchStatsType[]; title: string }>()
const checked = ref(false)
</script>

<template>
  <u-container class="my-10">
    <div class="flex justify-between mb-10">
      <div class="text-2xl font-semibold">{{ title }}</div>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS['bar-chart']"
        :unchecked-icon="ICONS['table']"
        color="secondary"
        size="lg"
        :ui="{ base: 'data-[state=unchecked]:bg-emerald-500 data-[state=unchecked]:dark:bg-emerald-800', icon: 'group-data-[state=unchecked]:text-emerald-700' }"
      />
    </div>
    <match-stats-chart
      v-if="checked"
      :stats
    />
    <match-stats-table :stats />
  </u-container>
</template>
