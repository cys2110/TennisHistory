<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<RoundInterface>[] = [
  {
    accessorKey: "round",
    header: "Round"
  },
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
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty> No awards available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
