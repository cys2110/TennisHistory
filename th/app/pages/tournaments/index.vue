<script setup lang="ts">
import { TableHeaderFilter, TableHeaderRange, UBadge } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

useHead({ title: "Tournaments" })

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
    header: ({ column }) => h(TableHeaderFilter, { column: column as Column<unknown>, label: "Tours" }),
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
      h(TableHeaderFilter, {
        column: column as Column<unknown>,
        label: "Name",
        type: "alpha"
      })
  },
  {
    accessorKey: "established",
    sortUndefined: "last",
    aggregationFn: "min",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Established" })
  },
  {
    accessorKey: "abolished",
    sortUndefined: "last",
    aggregationFn: "max",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Abolished" })
  }
]

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<TournamentInterface>) => {
  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    await navigateTo({
      name: "tournament",
      params: {
        id: row.original.id,
        name: kebabCase(row.original.name)
      }
    })
  }
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
        <u-dashboard-toolbar>
          <u-button
            label="Reset Sorting"
            :icon="ICONS.sortAlpha"
            @click="table?.tableApi.resetSorting()"
            size="sm"
          />
          <u-button
            label="Reset Filters"
            :icon="ICONS.noFilter"
            @click="table?.tableApi.resetColumnFilters()"
            size="sm"
          />
          <table-visibility
            v-if="table"
            :table="table!"
          />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <u-table
          ref="table"
          :data="tournaments"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedMinMaxValues: getFacetedMinMaxValues(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
        >
          <template #loading>
            <table-loading-icon />
          </template>

          <template #empty>
            <table-empty-message
              :icon="ICONS.noTournament"
              message="No tournaments found"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
