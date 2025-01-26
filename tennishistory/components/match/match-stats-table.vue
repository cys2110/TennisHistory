<script setup lang="ts">
// @ts-nocheck
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: MatchStatsType[] }>()

const p1_name = inject<string>("p1Name")
const p2_name = inject<string>("p2Name")
const p1_id = inject<string>("p1Id")
const p2_id = inject<string>("p2Id")

const columns: TableColumn<MatchStatsType>[] = [{ id: "p1" }, { accessorKey: "name", header: "Category", meta: { class: { td: "text-center font-semibold", th: "text-center" } } }, { id: "p2", meta: { class: { th: "text-right" } } }]

const isBold = (row: { name: string; values: number[] }, player: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  const singleStats = ["Aces", "Winners"]
  const bpsStats = ["Break points saved", "Break points converted"]
  switch (player) {
    case "p1":
      if (lowStats.includes(row.name)) {
        return row.values[0] < row.values[1]
      } else if (singleStats.includes(row.name)) {
        return row.values[0] > row.values[1]
      } else if (bpsStats.includes(row.name)) {
        if ((row.values[1] === 0 && row.values[3] === 0) || (row.values[1] !== 0 && row.values[3] === 0)) {
          return false
        } else if (row.values[1] === 0 && row.values[3] !== 0) {
          return true
        } else {
          return percentage(row.values[0], row.values[1]) > percentage(row.values[2], row.values[3])
        }
      } else {
        return percentage(row.values[0], row.values[1]) > percentage(row.values[2], row.values[3])
      }
    default:
      if (lowStats.includes(row.name)) {
        return row.values[1] < row.values[0]
      } else if (singleStats.includes(row.name)) {
        return row.values[1] > row.values[0]
      } else if (bpsStats.includes(row.name)) {
        if ((row.values[1] === 0 && row.values[3] === 0) || (row.values[3] !== 0 && row.values[1] === 0)) {
          return false
        } else if (row.values[3] === 0 && row.values[1] !== 0) {
          return true
        } else {
          return percentage(row.values[2], row.values[3]) > percentage(row.values[0], row.values[1])
        }
      } else {
        return percentage(row.values[2], row.values[3]) > percentage(row.values[0], row.values[1])
      }
  }
}
</script>

<template>
  <u-table
    :data="stats"
    :columns
  >
    <template #p1-header>
      <player-component
        v-if="p1_id && p1_name"
        :id="p1_id"
        :name="p1_name"
        :ui="{ name: 'font-bold text-lg' }"
      />
    </template>
    <template #p1-cell="{ row }">
      <u-progress
        v-if="row.original.values.length === 4"
        v-model="row.original.values[0]"
        :max="row.original.values[1]"
        :ui="{ base: 'bg-violet-300 dark:bg-violet-950', indicator: 'bg-violet-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
        inverted
      >
        <template #status="{ percent }">
          <span :class="{ 'font-bold': isBold(row.original, 'p1') }"> {{ row.original.values[0] }}/{{ row.original.values[1] }} ({{ percent }}%) </span>
        </template>
      </u-progress>
      <u-progress
        v-else
        v-model="row.original.values[0]"
        :max="row.original.values[0] + row.original.values[1]"
        :ui="{ base: 'bg-violet-300 dark:bg-violet-950', indicator: 'bg-violet-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
        inverted
      >
        <template #status>
          <span :class="{ 'font-bold': isBold(row.original, 'p1') }">{{ row.original.values[0] }}</span>
        </template>
      </u-progress>
    </template>

    <template #p2-header>
      <player-component
        v-if="p2_id && p2_name"
        :id="p2_id"
        :name="p2_name"
        :ui="{ name: 'font-bold text-lg', root: 'justify-end' }"
      />
    </template>
    <template #p2-cell="{ row }">
      <u-progress
        v-if="row.original.values.length === 4"
        v-model="row.original.values[2]"
        :max="row.original.values[3]"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
      >
        <template #status="{ percent }">
          <span :class="{ 'font-bold': isBold(row.original, 'p2') }">{{ row.original.values[2] }}/{{ row.original.values[3] }} ({{ percent }}%)</span>
        </template>
      </u-progress>
      <u-progress
        v-else
        v-model="row.original.values[1]"
        :max="row.original.values[0] + row.original.values[1]"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
      >
        <template #status>
          <span :class="{ 'font-bold': isBold(row.original, 'p2') }">{{ row.original.values[1] }}</span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
