<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[] }>()

const p1_name = inject<string>("p1Name")
const p1_id = inject<string>("p1Id")
const p2_name = inject<string>("p2Name")
const p2_id = inject<string>("p2Id")

const columns: TableColumn<{ key?: string; label: string; percent?: boolean; value: number[] }>[] = [
  { id: "p1", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300 w-2/5" } } },
  { accessorKey: "label", header: "Category", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg", td: "text-center text-slate-600 dark:text-slate-300" } } },
  { id: "p2", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300 w-2/5" } } }
]
</script>

<template>
  <u-table
    :data="stats"
    :columns
  >
    <template #p1-header>
      <u-user
        :name="p1_name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${p1_id}` }"
        :ui="{ name: 'font-bold text-lg text-slate-500 dark:text-slate-400' }"
        size="lg"
      />
    </template>
    <template #p1-cell="{ row }">
      <u-progress
        v-model="row.original.value[0]"
        :max="Math.max(row.original.value[1], row.original.value[0])"
        :ui="{ base: 'bg-violet-300 dark:bg-violet-950', indicator: 'bg-violet-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
        inverted
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.value[0] > row.original.value[1] }">{{ row.original.value[0] }} km/h ({{ Math.round(row.original.value[0] / 1.609344) }} mph) </span>
        </template>
      </u-progress>
    </template>

    <template #p2-header>
      <u-user
        :name="p2_name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${p2_id}` }"
        :ui="{ name: 'font-bold text-lg text-slate-500 dark:text-slate-400', root: 'flex-row-reverse' }"
        size="lg"
      />
    </template>
    <template #p2-cell="{ row }">
      <u-progress
        v-model="row.original.value[1]"
        :max="Math.max(row.original.value[1], row.original.value[0])"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.value[1] > row.original.value[0] }">{{ row.original.value[1] }} km/h ({{ Math.round(row.original.value[1] / 1.609344) }} mph) </span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
