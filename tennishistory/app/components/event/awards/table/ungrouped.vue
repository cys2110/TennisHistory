<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"
const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const {
  params: { year }
} = useRoute()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columns: TableColumn<RoundInterface>[] = [
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
    :data="awards"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No awards available for ${tournament?.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160' }"
  >
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
        :label="row.original.tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
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
