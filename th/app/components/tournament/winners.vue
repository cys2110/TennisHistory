<script setup lang="ts">
import {
  ArrayFilterTableHeader,
  CountryLink,
  FilterTableHeader,
  MatchScoreItem,
  NameTableHeader,
  RangeTableHeader,
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
  type GroupingOptions,
  type Row
} from "@tanstack/vue-table"

const {
  params: { id }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
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
    id: "expand",
    cell: ({ row }: { row: Row<TournamentWinnerEventType> }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          icon: uIcons.chevronDoubleRight,
          size: "xs",
          variant: "link",
          color: "neutral",
          onClick: () => row.toggleExpanded(),
          ui: { leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200" }
        })
      }
    }
  },
  {
    accessorKey: "year",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Year" }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) || (row.getIsGrouped() && row.groupingColumnId === "year")) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link default-link font-semibold"
          },
          () => cell.getValue()
        )
      }
    },
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      const uniqueYears = new Set(filteredRows.map(row => row.original.year))
      return `Events: ${uniqueYears.size}`
    }
  },
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Tour", type: "alpha" }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour(row.original.tour)
        })
      }
    }
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "S/D", type: "alpha" }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.type,
          color: getMatchTypeColour(row.original.type)
        })
      }
    }
  },
  columnHelper.group({
    id: "winners",
    header: COUNTRY_DRAWS.includes(id as string) ? undefined : "Winner(s)",
    columns: [
      {
        id: "winner_country",
        accessorFn: row =>
          Array.isArray(row.winner) ? row.winner.map(player => player.country.name)
          : typeof row.winner === "string" ? undefined
          : [row.winner.name],
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        sortUndefined: "last",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: COUNTRY_DRAWS.includes(id as string) ? "Winner" : "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped()) {
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
        header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
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
          Array.isArray(row.loser) ? row.loser.map(player => player.country.name)
          : typeof row.loser === "string" ? undefined
          : [row.loser?.name],
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        sortUndefined: "last",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: COUNTRY_DRAWS.includes(id as string) ? "Finalist" : "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped()) {
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
        header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
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
      if (tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) || !row.getIsGrouped()) {
        if (row.original.score) {
          return row.original.score
        } else if (typeof row.original.winner === "string") {
          return row.original.winner
        } else {
          const { tour, type, sets, id: eid, year, incomplete, stats } = row.original

          return h(MatchScoreItem, {
            tour,
            type,
            sets,
            tournament: { id: parseInt(id), name },
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

const columnFilters = ref([])
const grouping = computed(() =>
  tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) ? []
  : tours.length === 1 ? ["year"]
  : ["year", "tour"]
)
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
const columnVisibility = ref({
  expand: tableMode.value === "grouped",
  tour: tours.length > 1 && !COUNTRY_DRAWS.includes(id as string),
  type: !COUNTRY_DRAWS.includes(id as string),
  winner_name: !COUNTRY_DRAWS.includes(id as string),
  finalist_name: !COUNTRY_DRAWS.includes(id as string)
})
</script>

<template>
  <u-table
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
    :grouping-options="grouping_options"
    :ui="{ root: 'lg:max-w-full', td: 'empty:p-0' }"
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
        No finals found for {{ name }}
      </div>
    </template>
  </u-table>
</template>
