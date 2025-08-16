<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  players: EntryInterface[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<EntryInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<EntryInterface>[] = [
  {
    accessorKey: "year",
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
  },
  {
    accessorKey: "tour",
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 0) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[0]).length
        return `${uniqueStatuses[0]}s: ${count}`
      }
    }
  },
  {
    accessorKey: "type",
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 1) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[1]).length
        return `${uniqueStatuses[1]}s: ${count}`
      }
    }
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 2) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[2]).length
            return `${uniqueStatuses[2]}s: ${count}`
          }
        }
      },
      {
        id: "first_name",
        accessorFn: row => row.players.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 3) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[3]).length
            return `${uniqueStatuses[3]}s: ${count}`
          }
        }
      },
      {
        id: "last_name",
        accessorFn: row => row.players.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      }
    ]
  }),
  {
    id: "status",
    accessorFn: row => STATUSES[row.status as keyof typeof STATUSES].longName
  }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="players"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent' }"
  >
    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.eid } }"
        class="hover-link font-semibold"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #type-header="{ column }">
      <filter-table-header
        :column
        label="S/D"
        type="alpha"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #country-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country-cell="{ row }">
      <country-link
        v-for="player in row.original.players"
        :key="player.id"
        :country="player.country"
        class="mx-auto"
      />
    </template>

    <template #first_name-header="{ column }">
      <filter-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row }">
      <div class="flex flex-col items-center">
        <u-link
          v-for="player in row.original.players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
        >
          {{ player.first_name }}
        </u-link>
      </div>
    </template>

    <template #last_name-header="{ column }">
      <filter-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row }">
      <div class="flex flex-col items-center">
        <u-link
          v-for="player in row.original.players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>

    <template #status-header="{ column }">
      <filter-table-header
        :column
        label="Status"
        type="alpha"
      />
    </template>
  </u-table>
</template>
