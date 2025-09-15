<script setup lang="ts">
import { ArrayFilterTableHeader, FilterTableHeader, RangeTableHeader, UBadge } from "#components"
import { type TableColumn, type TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

useHead({ title: "Tournaments" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tournaments",
  description: "A collection of tennis tournaments"
}))
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data: tournaments, status } = await useFetch<TournamentInterface[]>("/api/tournaments", {
  key: "tournaments",
  default: () => [],
  server: false
})

const columns: TableColumn<TournamentInterface>[] = [
  {
    accessorKey: "tours",
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    filterFn: "arrIncludesSome",
    meta: { class: { td: "flex justify-center items-center gap-1" } },
    header: ({ column }) =>
      h(ArrayFilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tours"
      }),
    cell: ({ row }) =>
      row.original.tours?.map(tour =>
        h(UBadge, {
          key: `${row.original.id}-${tour}`,
          label: tour,
          color: getTourColour(tour)
        })
      ),
    footer: ({ table }) => `Total: ${table.getRowCount()}`
  },
  {
    accessorKey: "name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Name",
        type: "alpha"
      })
  },
  {
    accessorKey: "established",
    sortUndefined: "last",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Established" })
  },
  {
    accessorKey: "abolished",
    sortUndefined: "last",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Abolished" })
  }
]

const columnFilters = ref([])

const handleSelectRow = async (row: TableRow<TournamentInterface>) => {
  await navigateTo({
    name: "tournament",
    params: {
      id: row.original.id,
      name: kebabCase(row.original.name)
    }
  })
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>
      </template>
      <template #body>
        <u-table
          :data="tournaments"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          v-model:column-filters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedMinMaxValues: getFacetedMinMaxValues(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ tbody: '[&>tr]:cursor-pointer' }"
        >
          <template #loading>
            <u-icon
              :name="uIcons.loading"
              class="size-8"
            />
          </template>

          <template #empty>
            <div class="flex justify-center items-center w-full gap-2 text-error">
              <u-icon
                :name="icons.noTournament"
                class="text-base"
              />
              No tournaments found
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
