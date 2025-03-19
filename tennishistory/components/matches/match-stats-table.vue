<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[] }>()

const p1_name = inject<string>("p1Name")
const p2_name = inject<string>("p2Name")
const p1_id = inject<string>("p1Id")
const p2_id = inject<string>("p2Id")

const columns: TableColumn<{ key?: string; label: string; percent?: boolean; value: number[] }>[] = [
  { id: "p1", meta: { class: { td: "w-2/5" } } },
  { accessorKey: "label", header: "Category" },
  { id: "p2", meta: { class: { td: "w-2/5" } } }
]

const isBold = (row: { label: string; value: number[] }, player: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  const singleStats = ["Aces", "Winners"]
  const bpsStats = ["Break points saved", "Break points converted"]
  switch (player) {
    case "p1":
      if (lowStats.includes(row.label)) {
        return row.value[0] < row.value[1]
      } else if (singleStats.includes(row.label)) {
        return row.value[0] > row.value[1]
      } else if (bpsStats.includes(row.label)) {
        if ((row.value[1] === 0 && row.value[3] === 0) || (row.value[1] !== 0 && row.value[3] === 0)) {
          return false
        } else if (row.value[1] === 0 && row.value[3] !== 0) {
          return true
        } else {
          return percentage(row.value[0], row.value[1]) > percentage(row.value[2], row.value[3])
        }
      } else {
        return percentage(row.value[0], row.value[1]) > percentage(row.value[2], row.value[3])
      }
    default:
      if (lowStats.includes(row.label)) {
        return row.value[1] < row.value[0]
      } else if (singleStats.includes(row.label)) {
        return row.value[1] > row.value[0]
      } else if (bpsStats.includes(row.label)) {
        if ((row.value[1] === 0 && row.value[3] === 0) || (row.value[3] !== 0 && row.value[1] === 0)) {
          return false
        } else if (row.value[3] === 0 && row.value[1] !== 0) {
          return true
        } else {
          return percentage(row.value[2], row.value[3]) > percentage(row.value[0], row.value[1])
        }
      } else {
        return percentage(row.value[2], row.value[3]) > percentage(row.value[0], row.value[1])
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
      <u-user
        :name="p1_name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${p1_id}` }"
        :ui="{ name: 'font-bold text-lg text-(--ui-text-muted)' }"
        size="lg"
      />
    </template>

    <template #p1-cell="{ row }">
      <u-progress
        v-if="row.original.percent"
        v-model="row.original.value[0]"
        :max="row.original.value[1]"
        :ui="{ base: 'bg-primary-300 dark:bg-primary-950', indicator: 'bg-primary-600', status: '!w-full text-(--ui-text)' }"
        inverted
      >
        <template #status="{ percent }">
          <span :class="{ 'font-bold': isBold(row.original, 'p1') }"> {{ row.original.value[0] }}/{{ row.original.value[1] }} ({{ percent }}%) </span>
        </template>
      </u-progress>
      <u-progress
        v-else
        v-model="row.original.value[0]"
        :max="row.original.value[0] + row.original.value[1]"
        :ui="{ base: 'bg-primary-300 dark:bg-primary-950', indicator: 'bg-primary-700', status: '!w-full text-(--ui-text)' }"
        inverted
      >
        <template #status>
          <span :class="{ 'font-bold': isBold(row.original, 'p1') }">{{ row.original.value[0] }}</span>
        </template>
      </u-progress>
    </template>

    <template #p2-header>
      <u-user
        :name="p2_name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${p2_id}` }"
        :ui="{ name: 'font-bold text-lg text-(--ui-text-muted)', root: 'flex-row-reverse' }"
        size="lg"
      />
    </template>

    <template #p2-cell="{ row }">
      <u-progress
        v-if="row.original.percent"
        v-model="row.original.value[2]"
        :max="row.original.value[3]"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-(--ui-text)' }"
      >
        <template #status="{ percent }">
          <span :class="{ 'font-bold': isBold(row.original, 'p2') }">{{ row.original.value[2] }}/{{ row.original.value[3] }} ({{ percent }}%)</span>
        </template>
      </u-progress>
      <u-progress
        v-else
        v-model="row.original.value[1]"
        :max="row.original.value[0] + row.original.value[1]"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-(--ui-text)' }"
      >
        <template #status>
          <span :class="{ 'font-bold': isBold(row.original, 'p2') }">{{ row.original.value[1] }}</span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
