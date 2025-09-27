<script setup lang="ts">
import {
  ColouredBadge,
  CountryLink,
  MatchScoreItem,
  TableCellGroup,
  TableHeaderFilter,
  TableHeaderGroup,
  TableHeaderName,
  UButton,
  ULink
} from "#components"
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
import type { RouteLocationRaw } from "vue-router"

const {
  params: { id, name: paramName }
} = useRoute("tournament")
const toast = useToast()
const tours = inject<TourType[]>("tours", [])
const name = inject<string>("tournamentName", "")

// API call
const { data: finals, status } = await useFetch<TournamentWinnerEventType[]>("/api/tournaments/winners", {
  key: `tournament-winners-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentWinnerEventType>()

const columns = computed<TableColumn<TournamentWinnerEventType>[]>(() => [
  {
    accessorKey: "year",
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Year", type: "number" }),
    cell: ({ row, cell }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "year" }, () => cell.getValue()),
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      const uniqueYears = new Set(filteredRows.map(row => row.original.year))
      return `Events: ${uniqueYears.size}`
    }
  },
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
  columnHelper.group({
    id: "winners",
    header: COUNTRY_DRAWS.includes(id as string) ? undefined : "Winner(s)",
    columns: [
      {
        id: "winner_country",
        accessorFn: row =>
          Array.isArray(row.winner) ? row.winner.map(player => player.country.name) : typeof row.winner === "string" ? undefined : [row.winner.name],
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        sortUndefined: "last",
        header: ({ column }) =>
          h(TableHeaderFilter, {
            column: column as Column<unknown>,
            label: COUNTRY_DRAWS.includes(id as string) ? "Winner" : "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped() || grouping.value.length === 0) {
            if (Array.isArray(row.original.winner)) {
              return row.original.winner.map(player =>
                h(CountryLink, {
                  key: `${row.original.id}-${player.id}-${player.country.id}`,
                  country: player.country,
                  class: "mx-auto"
                })
              )
            } else if (typeof row.original.winner !== "string") {
              return h(CountryLink, {
                country: row.original.winner,
                class: "mx-auto",
                iconOnly: COUNTRY_DRAWS.includes(id as string) ? false : true
              })
            }
          }
        }
      },
      {
        id: "winner_name",
        accessorFn: row => (Array.isArray(row.winner) ? row.winner.map(player => `${player.last_name}, ${player.first_name}`) : undefined),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        sortUndefined: "last",
        header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (!row.getIsGrouped() || grouping.value.length === 0) {
            if (Array.isArray(row.original.winner)) {
              return h(
                "div",
                {
                  class: "flex flex-col items-center"
                },
                row.original.winner.map(player =>
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
      }
    ]
  }),
  columnHelper.group({
    id: "finalists",
    header: COUNTRY_DRAWS.includes(id as string) ? undefined : "Finalist(s)",
    columns: [
      {
        id: "finalist_country",
        accessorFn: row =>
          Array.isArray(row.loser) ? row.loser.map(player => player.country.name) : typeof row.loser === "string" ? undefined : [row.loser?.name],
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        sortUndefined: "last",
        header: ({ column }) =>
          h(TableHeaderFilter, { column: column as Column<unknown>, label: COUNTRY_DRAWS.includes(id as string) ? "Finalist" : "Country" }),
        cell: ({ row }) => {
          if (COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped() || grouping.value.length === 0) {
            if (Array.isArray(row.original.loser)) {
              return row.original.loser.map(player =>
                h(CountryLink, {
                  key: `${row.original.id}-${player.id}-${player.country.id}`,
                  country: player.country,
                  class: "mx-auto"
                })
              )
            } else if (typeof row.original.loser !== "string") {
              return h(CountryLink, {
                country: row.original.loser!,
                class: "mx-auto",
                iconOnly: COUNTRY_DRAWS.includes(id as string) ? false : true
              })
            }
          }
        }
      },
      {
        id: "finalist_name",
        accessorFn: row => (Array.isArray(row.loser) ? row.loser.map(player => `${player.last_name}, ${player.first_name}`) : undefined),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        sortUndefined: "last",
        header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (!row.getIsGrouped() || grouping.value.length === 0) {
            if (Array.isArray(row.original.loser)) {
              return h(
                "div",
                {
                  class: "flex flex-col items-center"
                },
                row.original.loser.map(player =>
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
      }
    ]
  }),
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped() || grouping.value.length === 0) {
        if (row.original.score) {
          return row.original.score
        } else if (typeof row.original.winner === "string") {
          return row.original.winner
        } else {
          const { tour, type, sets, id: eid, year, incomplete, stats } = row.original

          return h(MatchScoreItem, {
            draw: "Main",
            tour,
            type,
            sets,
            tournament: { id: parseInt(id), name: paramName },
            id: eid,
            year,
            match_no: 1,
            incomplete,
            centred: true,
            stats
          })
        }
      }
    }
  }
])

const table = useTemplateRef("table")
const columnFilters = ref([])
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})
const columnVisibility = ref({
  tour: tours.length > 1 && !COUNTRY_DRAWS.includes(id as string),
  type: !COUNTRY_DRAWS.includes(id as string),
  winner_name: !COUNTRY_DRAWS.includes(id as string),
  finalist_name: !COUNTRY_DRAWS.includes(id as string)
})

const handleSelectRow = async (row: TableRow<TournamentWinnerEventType>) => {
  toast.clear()

  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    toast.add({
      title: String(row.original.year),
      duration: Infinity,
      orientation: "horizontal",
      progress: false,
      actions: EVENT_PAGES.map(page => ({
        icon: page.icon,
        label: page.label,
        onClick: e => {
          toast.clear()
          navigateTo({
            name: page.name,
            params: {
              id,
              name: paramName,
              year: row.original.year,
              eid: row.original.id
            }
          } as RouteLocationRaw)
        }
      }))
    })
  }
}

onBeforeUnmount(() => toast.clear())
onBeforeRouteLeave(() => toast.clear())
</script>

<template>
  <div class="flex justify-between items-center">
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
    :data="finals"
    :columns
    :loading="['idle', 'pending'].includes(status)"
    sticky
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="grouping"
    v-on:update:grouping="grouping = $event"
    :grouping-options="grouping_options"
    @select="handleSelectRow"
    :ui="{ tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
  >
    <template #loading>
      <table-loading-icon />
    </template>

    <template #empty>
      <table-empty-message
        :icon="ICONS.noTournament"
        :message="`${name} has no finals played.`"
      />
    </template>
  </u-table>
</template>
