<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  tournaments: TournamentInterface[]
  status: APIStatusType
}>()

const columns: TableColumn<TournamentInterface>[] = [
  { accessorKey: "tours" },
  {
    accessorKey: "name",
    filterFn: "includesString",
    footer: ({ table }) => "Total: " + table.getFilteredRowModel().rows.length
  },
  { accessorKey: "established", sortUndefined: "last" },
  { accessorKey: "abolished", sortUndefined: "last" }
]

const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="tournaments"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No tournaments found"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent"
  >
    <template #tours-header="{ column }">
      <filter-table-header
        :column
        label="Tours"
        type="alpha"
      />
    </template>

    <template #tours-cell="{ row }">
      <u-badge
        v-for="tour in row.original.tours"
        :key="tour"
        :color="getTourColor([tour])"
        :label="tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
        class="mx-1"
      />
    </template>

    <template #name-header="{ column }">
      <input-table-header
        :column
        label="Tournaments"
        type="alpha"
      />
    </template>

    <template #name-cell="{ row, cell }">
      <u-link
        class="hover-link"
        :to="{ name: 'tournament', params: { id: row.original.id, name: kebabCase(cell.getValue() as string) } }"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #established-header="{ column }">
      <range-table-header
        :column
        label="Established"
      />
    </template>

    <template #abolished-header="{ column }">
      <range-table-header
        :column
        label="Abolished"
      />
    </template>
  </u-table>
</template>
