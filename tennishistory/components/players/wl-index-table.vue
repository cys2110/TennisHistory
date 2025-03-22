<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ index: WLIndexInterface[] }>()

const columns: TableColumn<WLIndexInterface>[] = [
  { accessorKey: "category", header: "Category" },
  { accessorKey: "stat", header: "Statistic" },
  { accessorKey: "wins", header: "Wins" },
  { accessorKey: "losses", header: "Losses" },
  { accessorFn: row => row.titles ?? "—", header: "Titles" },
  { accessorKey: "value", header: "Index" }
]
</script>

<template>
  <u-table
    :data="index"
    :columns
    sticky
    class="max-w-full xl:w-3/4 mx-auto"
  />
</template>
