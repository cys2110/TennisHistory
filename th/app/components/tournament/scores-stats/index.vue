<script setup lang="ts">
import { ColouredBadge, CountryLink, TableCellGroup, TableHeaderGroup, TableHeaderName, TableHeaderRange, UButton, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

const {
  params: { id, name }
} = useRoute("tournament")
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: winners, status } = await useFetch<TournamentScoreStatsType[]>("/api/tournaments/scores-stats", {
  key: `tournament-scores-stats-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentScoreStatsType>()

const columns = computed<TableColumn<TournamentScoreStatsType>[]>(() => [
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Tour" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { class: "mx-auto", label: row.getValue("tour") as string })
      )
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "S/D" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "type" }, () =>
        h(ColouredBadge, { class: "mx-auto", label: row.getValue("type") as string })
      )
  },
  {
    accessorKey: "year",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Year" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link default-link font-semibold"
          },
          () => row.original.year
        )
      }
    }
  },
  columnHelper.group({
    id: "players",
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.team.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Country" }),
        cell: ({ row }) =>
          h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "country" }, () =>
            h(
              "div",
              { class: "flex flex-col items-center" },
              row.original.team.map(player => h(CountryLink, { key: `${row.original.id}-${player.id}`, country: player.country, showName: false }))
            )
          )
      },
      {
        id: "name",
        accessorFn: row => row.team.map(player => `${player.first_name} ${player.last_name}`),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (!row.getIsGrouped() || grouping.value.length === 0) {
            return h(
              "div",
              { class: "flex flex-col items-center" },
              row.original.team.map(player =>
                h(
                  ULink,
                  {
                    key: `${row.original.id}-${player.id}`,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name}, ${player.last_name}`) } },
                    class: "hover-link default-link w-fit"
                  },
                  () => `${player.first_name} ${player.last_name}`
                )
              )
            )
          }
        }
      }
    ]
  }),
  columnHelper.group({
    header: "Sets",
    columns: [
      {
        accessorKey: "sets_won",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Won" })
      },
      {
        accessorKey: "sets_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Lost" })
      },
      {
        id: "sets_pc",
        accessorFn: row => (row.sets_won + row.sets_lost ? percentage(row.sets_won, row.sets_won + row.sets_lost) : 0),
        aggregationFn: "mean",
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Win %" }),
        cell: row => `${Math.round(row.getValue() as number)}%`
      }
    ]
  }),
  columnHelper.group({
    header: "Games",
    columns: [
      {
        accessorKey: "games_won",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Won" })
      },
      {
        accessorKey: "games_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Lost" })
      },
      {
        id: "games_pc",
        accessorFn: row => (row.games_won + row.games_lost ? percentage(row.games_won, row.games_won + row.games_lost) : 0),
        aggregationFn: "mean",
        cell: row => `${Math.round(row.getValue() as number)}%`,
        header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Win %" })
      }
    ]
  })
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
      <tournament-scores-stats-chart
        v-if="mdAndUp"
        :winners
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
    :data="winners"
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
        :icon="ICONS.noTournament"
        :message="`No winners found for ${tournamentName}`"
      />
    </template>
  </u-table>
</template>
