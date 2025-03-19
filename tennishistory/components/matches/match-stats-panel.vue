<script setup lang="ts">
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[]; title: string; checked: boolean }>()
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-2 mb-5">
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">{{ title }}</h1>
    </div>

    <match-stats-table
      v-if="checked"
      :stats
    />

    <match-stats-chart
      v-else
      :stats
    />
  </div>
</template>
