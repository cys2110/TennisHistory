<script setup lang="ts">
import { ColouredBadge, TableCellGroup, TableHeaderGroup, TableHeaderRange, UButton, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

const {
  params: { id, name }
} = useRoute("tournament")
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: rounds, status } = await useFetch<TournamentPmType[]>("/api/tournaments/pm", {
  key: `tournament-pm-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<TournamentPmType>[]>(() => [
  {
    accessorKey: "year",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Year", type: "number" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "year" }, () =>
        h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link default-link font-semibold"
          },
          () => row.original.year
        )
      )
  },
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Tour" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { label: row.getValue("tour") as string, class: "mx-auto" })
      )
  },
  {
    accessorKey: "type",
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "S/D" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "type" }, () =>
        h(ColouredBadge, { label: row.getValue("type") as string, class: "mx-auto" })
      )
  },
  {
    accessorKey: "round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Round" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "round" }, () => row.getValue("round"))
  },
  {
    accessorKey: "pm",
    cell: ({ row, cell }) =>
      isDefined(cell.getValue()) && row.original.currency
        ? (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
        : undefined,
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Prize Money" })
  },
  {
    accessorKey: "points",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Points" }),
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined),
    aggregationFn: "max",
    sortUndefined: "last"
  }
])

const table = useTemplateRef("table")
const columnVisibility = computed(() => ({
  tour: tours.length > 1
}))
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <client-only>
    <teleport to="#chart-container">
      <tournament-pm-chart
        v-if="mdAndUp"
        :rounds
      />
    </teleport>
  </client-only>
  <div class="flex items-center justify-between mb-5">
    <u-button
      label="Reset Sorting"
      :icon="ICONS.sortAlpha"
      @click="table?.tableApi.resetSorting()"
      size="sm"
    />
    <u-button
      label="Reset Grouping"
      :icon="ICONS.ungroup"
      @click="table?.tableApi.resetGrouping()"
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
  </div>
  <u-table
    ref="table"
    :data="rounds"
    :columns
    :loading="['idle', 'pending'].includes(status)"
    sticky
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    v-on:update:grouping="grouping = $event"
    :grouping-options="grouping_options"
    v-model:column-visibility="columnVisibility"
    :ui="{ td: 'empty:p-0' }"
  >
    <template #loading>
      <table-loading-icon />
    </template>

    <template #empty>
      <table-empty-message
        :icon="ICONS.noAwards"
        :message="`No prize money found for ${tournamentName}`"
      />
    </template>
  </u-table>
</template>
