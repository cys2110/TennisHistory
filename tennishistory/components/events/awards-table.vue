<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { awards } = defineProps<{ awards: RoundInterface[] | null; status: string }>()

const columns: TableColumn<RoundInterface>[] = [
  { accessorKey: "round", header: "Round" },
  { accessorKey: "points", header: "Points", cell: ({ row }) => row.getValue("points") ?? "—" },
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
    class="w-fit mx-auto px-15"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #empty>
      <div
        v-if="['pending', 'idle'].includes(status)"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 3"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No awards available</template>
    </template>
  </u-table>
</template>
