<script setup lang="ts">
import { ColouredBadge, TableCellGroup, TableHeaderGroup, TableHeaderRange } from "#components"
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
  params: { eid, year }
} = useRoute("event")
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  key: `event-awards-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<RoundInterface>[]>(() => [
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Tour" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { label: row.original.tour, class: "mx-auto" })
      )
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "S/D" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "type" }, () =>
        h(ColouredBadge, { label: row.original.type, class: "mx-auto" })
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
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Prize Money" }),
    cell: ({ row, cell }) =>
      isDefined(cell.getValue()) && row.original.currency
        ? (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
        : undefined
  },
  {
    accessorKey: "points",
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Points" }),
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined)
  }
])

const table = useTemplateRef("table")
const columnVisibility = computed(() => ({
  tour: tours.value?.length > 1
}))
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <dashboard-subpanel
    id="awards"
    title="Awards"
    :icon="ICONS.awards"
    class="max-h-200"
  >
    <template #right>
      <event-awards-chart
        v-if="awards.length && mdAndUp"
        :awards
      />
    </template>

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
      :data="awards"
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
          :message="`No awards found for ${tournamentName} ${year}`"
        />
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
