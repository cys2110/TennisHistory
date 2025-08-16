<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  rounds: TournamentPmType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columns: TableColumn<TournamentPmType>[] = [
  { accessorKey: "year" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "round" },
  {
    accessorKey: "pm",
    cell: ({ row }) =>
      isDefined(row.original.pm) && row.original.currency ?
        row.original.pm.toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
      : undefined,
    sortUndefined: "last"
  },
  {
    accessorKey: "points",
    cell: ({ row }) => (isDefined(row.original.points) ? row.original.points.toLocaleString() : undefined),
    sortUndefined: "last"
  }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="rounds"
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
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160' }"
  >
    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
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

    <template #round-header="{ column }">
      <filter-table-header
        :column
        label="Round"
        type="alpha"
      />
    </template>

    <template #pm-header="{ column }">
      <range-table-header
        :column
        label="Prize Money"
      />
    </template>

    <template #points-header="{ column }">
      <range-table-header
        :column
        label="Points"
      />
    </template>
  </u-table>
</template>
