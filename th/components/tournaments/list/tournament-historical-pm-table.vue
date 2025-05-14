<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { pm, status } = defineProps<{ pm: HistoricalPMInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<HistoricalPMInterface>[] = [
  {
    accessorKey: "year",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Year",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) =>
      h(
        ULink,
        {
          class: "hover-link w-fit",
          to: {
            name: "event",
            params: {
              id: route.params.id as string,
              name: route.params.name as string,
              eid: row.original.id,
              year: row.original.year
            }
          }
        },
        () => row.getValue("year")
      )
  },
  {
    accessorFn: row => row.pm.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Prize Money"
  },
  { accessorFn: row => row.yoy, header: "Increase (YoY)" },
  {
    accessorFn: row => row.W.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Win"
  },
  {
    accessorFn: row => row.F.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Final"
  },
  {
    accessorFn: row => row.SF.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Semi-final"
  },
  {
    accessorFn: row => row.QF.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Quarter-final"
  },
  {
    accessorFn: row => row.R16.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Round of 16"
  },
  {
    accessorFn: row => row.R32.toLocaleString("en-US", { style: "currency", currency: row.currency }),
    header: "Round of 32"
  }
]
if (pm?.[0].R64) {
  columns.push({
    accessorFn: row => (row.R64 ? row.R64.toLocaleString("en-US", { style: "currency", currency: row.currency }) : "—"),
    header: "Round of 64"
  })
}
if (pm?.[0].R128) {
  columns.push({
    accessorFn: row => (row.R128 ? row.R128.toLocaleString("en-US", { style: "currency", currency: row.currency }) : "—"),
    header: "Round of 128"
  })
}
</script>

<template>
  <u-table
    :data="pm"
    :columns="columns"
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
    <template #empty> No prize money found for {{ name }} </template>
  </u-table>
</template>
