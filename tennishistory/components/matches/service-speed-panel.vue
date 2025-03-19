<script setup lang="ts">
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[]; checked: boolean }>()
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-2 mb-5">
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Service Speed</h1>
    </div>

    <div
      v-if="!checked"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
    >
      <service-speed-gauge
        v-for="stat in stats"
        :key="stat.label"
        :stat
      />
    </div>

    <service-speed-table
      v-else
      :stats
    />
  </div>
</template>
