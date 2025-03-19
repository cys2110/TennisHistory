<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { awards } = defineProps<{ awards: RoundInterface[] }>()

const columns: TableColumn<RoundInterface>[] = [
  {
    accessorKey: "round",
    header: "Round"
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => row.getValue("points") ?? "—"
  },
  {
    accessorFn: row => (row.currency && row.pm ? `${CURRENCIES[row.currency]}${row.pm}` : "—"),
    header: "Prize Money"
  }
]
</script>

<template>
  <u-table
    :data="awards"
    :columns
    class="my-5 w-fit mx-auto"
  />
</template>
