<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  entries: EntryInterface[]
  status: APIStatusType
  tournament: TournamentInterface
}>()
const {
  params: { year }
} = useRoute()

const columnHelper = createColumnHelper<EntryInterface>()

const columns: TableColumn<EntryInterface>[] = [
  { accessorKey: "country.name" },
  columnHelper.group({
    header: "Player",
    columns: [{ accessorKey: "tour" }, { accessorKey: "first_name" }, { accessorKey: "last_name" }]
  }),
  { accessorKey: "singles_rank", sortUndefined: "last" },
  { accessorKey: "doubles_rank", sortUndefined: "last" }
]

const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="entries"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No entries found for ${tournament.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent' }"
  >
    <template #country_name-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country_name-cell="{ row }">
      <country-link
        :country="row.original.country"
        class="mx-auto"
      />
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

    <template #first_name-header="{ column }">
      <input-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row, cell }">
      <u-link
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #last_name-header="{ column }">
      <input-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row, cell }">
      <u-link
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #singles_rank-header="{ column }">
      <range-table-header
        :column
        label="Singles Rank"
      />
    </template>

    <template #doubles_rank-header="{ column }">
      <range-table-header
        :column
        label="Doubles Rank"
      />
    </template>
  </u-table>
</template>
