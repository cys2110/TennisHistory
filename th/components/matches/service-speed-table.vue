<script setup lang="ts">
// @ts-ignore
import kmhToMph from "kmh-to-mph"
import type { TableColumn } from "@nuxt/ui"
defineProps<{
  stats: { key?: string; label: string; percent?: boolean; value: number[] }[]
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()

const columns: TableColumn<{ key?: string; label: string; percent?: boolean; value: number[] }>[] = [
  { id: "p1", meta: { class: { td: "w-2/5" } } },
  { accessorKey: "label", header: "Category" },
  { id: "p2", meta: { class: { td: "w-2/5" } } }
]
</script>

<template>
  <u-table
    :data="stats"
    :columns
  >
    <template #p1-header>
      <player-avatar :player="p1" />
    </template>
    <template #p1-cell="{ row }">
      <u-progress
        v-model="row.original.value[0]"
        :max="Math.max(row.original.value[1], row.original.value[0])"
        :ui="{ base: 'bg-primary-300 dark:bg-primary-950', indicator: 'bg-primary-700', status: '!w-full text-(--ui-text)' }"
        inverted
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.value[0] > row.original.value[1] }">{{ row.original.value[0] }} km/h ({{ Math.round(kmhToMph(row.original.value[0])) }} mph) </span>
        </template>
      </u-progress>
    </template>

    <template #p2-header>
      <player-avatar
        :player="p2"
        class="justify-end"
      />
    </template>
    <template #p2-cell="{ row }">
      <u-progress
        v-model="row.original.value[1]"
        :max="Math.max(row.original.value[1], row.original.value[0])"
        :ui="{ base: 'bg-emerald-300/50 dark:bg-emerald-950', indicator: 'bg-emerald-700', status: '!w-full text-(--ui-text)' }"
      >
        <template #status>
          <span :class="{ 'font-bold': row.original.value[1] > row.original.value[0] }">{{ row.original.value[1] }} km/h ({{ Math.round(kmhToMph(row.original.value[1])) }} mph) </span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
