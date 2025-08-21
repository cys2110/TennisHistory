<script setup lang="ts">
import { CountryLink, FilterTableHeader, MatchScoreItem, RangeTableHeader, SortTableHeader, UBadge, UButton, ULink } from "#components"
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

const { tours, tournament } = defineProps<{
  tournament: TournamentInterface
  tours: TourType[]
}>()
const { eid, id, year, name } = useRoute().params as { eid: string; id: string; year: string; name: string }
const { tableMode } = useDefaults()

// API call
const { data: matches, status } = await useFetch<MatchInterface[]>("/api/events/results-table", {
  key: `results-table-${eid}`,
  query: { id: eid },
  default: () => []
})
const {
  ui: { icons }
} = useAppConfig()

const columnHelper = createColumnHelper<MatchInterface>()

const columns = computed<TableColumn<MatchInterface>[]>(() => [
  ...(tableMode.value === "grouped" ?
    [
      {
        id: "expand",
        cell: ({ row }: { row: any }) => {
          if (row.getIsGrouped()) {
            return h(UButton, {
              variant: "link",
              color: "neutral",
              class: "mr-2",
              size: "xs",
              icon: icons.chevronDoubleRight,
              ui: {
                leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200"
              },
              onClick: () => row.toggleExpanded()
            })
          }
        }
      }
    ]
  : []),
  {
    accessorKey: "tour",
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
          color: getTourColour([row.original.tour]),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && tours.length > 1 && row.depth === 1) || (tours.length === 1 && row.depth === 0)) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "round",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && tours.length > 1 && row.depth === 2) || (tours.length === 1 && row.depth === 1)) {
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
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Court",
        type: "alpha"
      })
  },
  {
    accessorKey: "umpire",
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
            class: "hover-link w-fit mx-auto"
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
        header: ({ column }) =>
          h(FilterTableHeader, {
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
        id: "winner_first_name",
        accessorFn: row => row.winners.players.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
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
                    class: "hover-link"
                  },
                  () => player.first_name
                )
              )
            )
          }
        }
      },
      {
        id: "winner_last_name",
        accessorFn: row => row.winners.players.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
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
                    class: "hover-link"
                  },
                  () => player.last_name
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
        header: ({ column }) =>
          h(FilterTableHeader, {
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
        header: ({ column }) =>
          h(FilterTableHeader, {
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
        id: "loser_first_name",
        accessorFn: row => row.losers.players.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
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
                    class: "hover-link"
                  },
                  () => player.first_name
                )
              )
            )
          }
        }
      },
      {
        id: "loser_last_name",
        accessorFn: row => row.losers.players.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
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
                    class: "hover-link"
                  },
                  () => player.last_name
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
        header: ({ column }) =>
          h(FilterTableHeader, {
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
          labels: [row.original.tour, row.original.type, row.original.round.includes("Qualifying") ? "Qualifying" : "Main"],
          sets: row.original.sets,
          tournament,
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
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => {
  return (
    tableMode.value === "grouped" ?
      tours.length > 1 ?
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
  <u-table
    :data="matches"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No matches found for ${tournament?.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165', td: 'empty:p-0' }"
  />
</template>
