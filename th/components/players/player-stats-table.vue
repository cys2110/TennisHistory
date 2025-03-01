<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { stats } = defineProps<{ stats: PlayerStatsType[] }>()

const numberStats = stats.map(stat => ({
  ...stat,
  value: Number(stat.value)
}))

const columns: TableColumn<{ category: string; value: number; suffix?: boolean }>[] = [
  { accessorKey: "category", header: "Category", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg w-1/2", td: "text-center text-slate-600 dark:text-slate-300 w-1/3" } } },
  { accessorKey: "value", header: "", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg w-2/3", td: "text-center text-slate-600 dark:text-slate-300 w-2/3" } } }
]
</script>

<template>
  <u-table
    :data="numberStats"
    :columns
    class="md:w-3/4 lg:w-2/3 mx-auto"
  >
    <template #value-cell="{ row }">
      <template v-if="row.original.suffix === false">{{ row.original.value }}</template>
      <u-progress
        v-else
        v-model="row.original.value"
        :max="100"
        :ui="{ base: 'bg-violet-300 dark:bg-violet-950', indicator: 'bg-violet-600', status: '!w-full text-slate-700 dark:text-slate-300' }"
      >
        <template #status="{ percent }">{{ percent }}%</template>
      </u-progress>
    </template>
  </u-table>
</template>
