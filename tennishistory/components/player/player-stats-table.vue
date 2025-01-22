<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ stats: PlayerStatsType[] }>()

const columns: TableColumn<PlayerStatsType>[] = [
  { accessorKey: "category", header: "Category" },
  { accessorKey: "value", header: "" }
]
</script>

<template>
  <u-table
    :data="stats"
    :columns
  >
    <template #value-cell="{ row }">{{ row.original.value.low }}{{ row.original.suffix === false ? null : "%" }}</template>
  </u-table>
</template>
