<script setup lang="ts">
import {
  ArrayFilterTableHeader,
  CountryLink,
  FilterTableHeader,
  MatchScoreItem,
  NameTableHeader,
  RangeTableHeader,
  SortTableHeader,
  UBadge,
  UButton,
  ULink
} from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "results" })
const {
  params: { id, year, name, eid }
} = useRoute("results")
const { tableMode } = useDefaults()
const {
  ui: { icons: uIcons }
} = useAppConfig()

const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: matches, status } = await useFetch<MatchInterface[]>("/api/events/results", {
  key: `results-table-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<MatchInterface>()

const columns = computed<TableColumn<MatchInterface>[]>(() => [
  {
    id: "expand",
    cell: ({ row }: { row: any }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          variant: "link",
          color: "neutral",
          class: "mr-2",
          size: "xs",
          icon: uIcons.chevronDoubleRight,
          ui: {
            leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200"
          },
          onClick: () => row.toggleExpanded()
        })
      }
    }
  },
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour(row.original.tour),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 1 : row.depth === 0))) {
        return h(UBadge, {
          label: row.original.type,
          color: getMatchTypeColour(row.original.type),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 2 : row.depth === 1))) {
        return cell.getValue()
      }
    }
  },
  {
    id: "date",
    accessorFn: row => (row.date ? getDate(row.date) : undefined),
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Date",
        type: "number"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        if (cell.getValue()) {
          return useDateFormat(cell.getValue() as any, "dddd DD MMMM, YYYY").value
        }
      }
    }
  },
  {
    id: "duration",
    accessorFn: row => (row.duration ? row.duration.hours * 60 * 60 + row.duration.minutes * 60 + row.duration.seconds : undefined),
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Duration",
        type: "number"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        const duration = row.original.duration
        if (duration) {
          return `${duration.hours.toString().padStart(2, "0")}:${duration.minutes.toString().padStart(2, "0")}:${duration.seconds.toString().padStart(2, "0")}`
        }
      }
    }
  },
  {
    accessorKey: "court",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Court",
        type: "alpha"
      })
  },
  {
    accessorKey: "umpire",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Umpire",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if ((tableMode.value === "ungrouped" || !row.getIsGrouped()) && row.original.umpire) {
        return h(
          ULink,
          {
            to: { name: "umpire", params: { id: kebabCase(row.original.umpire) } },
            class: "hover-link default-link w-fit mx-auto"
          },
          () => cell.getValue()
        )
      }
    }
  },
  columnHelper.group({
    header: "Winner",
    columns: [
      {
        id: "winner_country",
        accessorFn: row => row.winners.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.winners.players.map(player =>
              h(CountryLink, {
                country: player.country,
                key: `${player.id}-${player.country.id}`,
                class: "mx-auto"
              })
            )
          }
        }
      },
      {
        id: "winner_name",
        accessorFn: row => row.winners.players.map(player => `${player.last_name}, ${player.first_name}`),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        header: ({ column }) =>
          h(NameTableHeader, {
            column: column as Column<unknown>,
            label: "Name",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              "div",
              {
                class: "flex flex-col items-center"
              },
              row.original.winners.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: {
                      name: "player",
                      params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) }
                    },
                    class: "hover-link default-link w-fit"
                  },
                  () => `${player.first_name} ${player.last_name}`
                )
              )
            )
          }
        }
      },
      {
        id: "winner_seed",
        accessorFn: row =>
          row.round.includes("Qualifying") ? (row.winners.players[0]!.q_seed ?? undefined) : (row.winners.players[0]!.seed ?? undefined),
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Seed"
          }),
        cell: ({ cell, row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return cell.getValue()
          }
        }
      },
      {
        id: "winner_status",
        accessorFn: row =>
          row.round.includes("Qualifying") ? (row.winners.players[0]!.q_status ?? undefined) : (row.winners.players[0]!.status ?? undefined),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Status",
            type: "alpha"
          }),
        cell: ({ cell, row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return cell.getValue()
          }
        }
      }
    ]
  }),
  columnHelper.group({
    header: "Loser",
    columns: [
      {
        id: "loser_country",
        accessorFn: row => row.losers.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.losers.players.map(player =>
              h(CountryLink, {
                country: player.country,
                key: `${player.id}-${player.country.id}`,
                class: "mx-auto"
              })
            )
          }
        }
      },
      {
        id: "loser_name",
        accessorFn: row => row.losers.players.map(player => `${player.last_name}, ${player.first_name}`),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        header: ({ column }) =>
          h(NameTableHeader, {
            column: column as Column<unknown>,
            label: "Name",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              "div",
              {
                class: "flex flex-col items-center"
              },
              row.original.losers.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: {
                      name: "player",
                      params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) }
                    },
                    class: "hover-link default-link w-fit"
                  },
                  () => `${player.first_name} ${player.last_name}`
                )
              )
            )
          }
        }
      },
      {
        id: "loser_seed",
        accessorFn: row =>
          row.round.includes("Qualifying") ? (row.losers.players[0]!.q_seed ?? undefined) : (row.losers.players[0]!.seed ?? undefined),
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Seed"
          }),
        cell: ({ cell, row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return cell.getValue()
          }
        }
      },
      {
        id: "loser_status",
        accessorFn: row =>
          row.round.includes("Qualifying") ? (row.losers.players[0]!.q_status ?? undefined) : (row.losers.players[0]!.status ?? undefined),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Status",
            type: "alpha"
          }),
        cell: ({ cell, row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return cell.getValue()
          }
        }
      }
    ]
  }),
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(MatchScoreItem, {
          tour: row.original.tour,
          type: row.original.type,
          sets: row.original.sets,
          tournament: { id: parseInt(id), name },
          id: parseInt(eid),
          year: parseInt(year),
          match_no: row.original.match_no,
          incomplete: row.original.incomplete,
          stats: row.original.stats,
          centred: true
        })
      }
    }
  }
])

const columnFilters = ref([])
const columnVisibility = computed(() => ({
  tour: tours.value.length > 1,
  expand: tableMode.value === "grouped"
}))
const grouping = computed(() => {
  return (
    tableMode.value === "grouped" ?
      tours.value.length > 1 ?
        ["tour", "type", "round"]
      : ["type", "round"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <event-wrapper>
    <u-table
      :data="matches"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedUniqueValues: getFacetedUniqueValues()
      }"
      :grouping
      :grouping-options="grouping_options"
      v-model:columnFilters="columnFilters"
      v-model:column-visibility="columnVisibility"
      :ui="{ td: 'empty:p-0', root: '2xl:max-w-19/20' }"
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
            :name="uIcons.caution"
            class="text-base"
          />
          No results found for {{ tournamentName }} {{ year }}
        </div>
      </template>
    </u-table>
  </event-wrapper>
</template>
