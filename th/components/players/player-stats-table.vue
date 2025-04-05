<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: PlayerStatsInterface[] }>()

const columns: TableColumn<{ category: string; value: number; suffix?: boolean }>[] = [
  { accessorKey: "category", header: "Category", meta: { class: { th: "w-1/2", td: "w-1/3" } } },
  { accessorKey: "value", header: "", meta: { class: { th: "w-2/3", td: "w-2/3" } } }
]
</script>

<template>
  <u-table
    :data="stats"
    :columns
    class="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto"
  >
    <template #value-cell="{ row }">
      <template v-if="row.original.suffix === false">{{ row.original.value }}</template>
      <u-progress
        v-else
        v-model="row.original.value"
        :max="100"
        :ui="{ base: 'bg-primary-300 dark:bg-primary-950', indicator: 'bg-primary-600', status: '!w-full text-(--ui-text-muted)' }"
      >
        <template #status="{ percent }">{{ percent }}%</template>
      </u-progress>
    </template>
  </u-table>
</template>
