<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ index: WLIndexType[] }>()

const columns: TableColumn<WLIndexType>[] = [
  { accessorKey: "category", header: "Category" },
  { accessorKey: "stat", header: "Statistic" },
  { accessorKey: "wins", header: "Wins" },
  { accessorKey: "losses", header: "Losses" },
  { accessorKey: "titles", header: "Titles" },
  { accessorKey: "value", header: "Index" }
]
</script>

<template>
  <u-table
    :data="index"
    :columns
    class="xl:w-3/4 mx-auto"
  />
</template>
