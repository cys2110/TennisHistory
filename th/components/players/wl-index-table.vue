<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ index: WLIndexInterface[] | null; status: string }>()

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
    :data="index || []"
    :columns
    sticky
    class="max-w-full xl:w-1/2 mx-auto"
    :loading="status === 'pending'"
  >
    <template #empty>
      <div
        v-if="status === 'pending'"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton class="h-4 w-36 rounded-lg" />
          <u-skeleton class="h-4 w-30 rounded-lg" />
          <u-skeleton class="h-4 w-20 rounded-lg" />
          <u-skeleton class="ml-2 h-4 w-20 rounded-lg" />
          <u-skeleton class="ml-5 h-4 w-20 rounded-lg" />
          <u-skeleton class="ml-2 h-4 w-20 rounded-lg" />
        </div>
      </div>
      <template v-else>No index available</template>
    </template>
  </u-table>
</template>
