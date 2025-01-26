<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: MatchStatsType[] }>()

const p1_name = inject<string>("p1Name")
const p1_id = inject<string>("p1Id")
const p2_name = inject<string>("p2Name")
const p2_id = inject<string>("p2Id")

const columns: TableColumn<MatchStatsType>[] = [{ id: "p1" }, { accessorKey: "name", header: "Category", meta: { class: { td: "text-center font-semibold", th: "text-center" } } }, { id: "p2", meta: { class: { th: "text-right" } } }]
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
        v-model="row.original.values[0]"
        :max="Math.max(row.original.values[1], row.original.values[0])"
        :ui="{ base: 'bg-violet-300 dark:bg-violet-950', indicator: 'bg-violet-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
        inverted
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.values[0] > row.original.values[1] }">{{ row.original.values[0] }} km/h ({{ Math.round(row.original.values[0] / 1.609344) }} mph) </span>
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
        v-model="row.original.values[1]"
        :max="Math.max(row.original.values[1], row.original.values[0])"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-slate-700 dark:text-slate-300' }"
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.values[1] > row.original.values[0] }">{{ row.original.values[1] }} km/h ({{ Math.round(row.original.values[1] / 1.609344) }} mph) </span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
