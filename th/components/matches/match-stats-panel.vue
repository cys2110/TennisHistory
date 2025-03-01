<script setup lang="ts">
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[]; title: string }>()
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
      />
    </div>
    <match-stats-chart
      v-if="checked"
      :stats
    />
    <match-stats-table
      v-else
      :stats
    />
  </u-container>
</template>
