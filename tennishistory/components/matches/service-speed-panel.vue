<script setup lang="ts">
defineProps<{
  stats: { key?: string; label: string; percent?: boolean; value: number[] }[]
  checked: boolean
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()
</script>

<template>
  <dashboard-subpanel title="Service Speed">
    <div
      v-if="checked"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
    >
      <service-speed-gauge
        v-for="stat in stats"
        :key="stat.label"
        :stat
        :p1="p1"
        :p2="p2"
      />
    </div>

    <service-speed-table
      v-else
      :stats
      :p1="p1"
      :p2="p2"
    />
  </dashboard-subpanel>
</template>
