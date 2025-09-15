<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UBadge } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

const {
  params: { id }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistType[]>("/api/tournaments/finalists", {
  key: `tournament-finalists-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentFinalistType>()

const columns: TableColumn<TournamentFinalistType>[] = [
  columnHelper.group({
    header: "Player",
    columns: [
      {
        accessorKey: "player.tour",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Tour",
            type: "alpha"
          }),
        cell: ({ row }) =>
          h(UBadge, {
            label: row.original.player.tour,
            color: getTourColour(row.original.player.tour)
          })
      },
      {
        accessorKey: "player.country.name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) =>
          h(CountryLink, {
            country: row.original.player.country,
            class: "mx-auto"
          })
      },
      {
        id: "player_name",
        accessorFn: row => `${row.player.last_name}, ${row.player.first_name}`,
        filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
        header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => `${row.original.player.first_name} ${row.original.player.last_name}`
      }
    ]
  }),
  {
    accessorKey: "finals",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Finals Played"
      })
  },
  columnHelper.group({
    header: "Singles",
    columns: [
      {
        accessorKey: "singles_wins",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Wins"
          })
      },
      {
        accessorKey: "singles_losses",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Losses"
          })
      },
      {
        id: "singles_percent",
        accessorFn: row => `${row.singles_wins + row.singles_losses ? percentage(row.singles_wins, row.singles_wins + row.singles_losses) : 0}%`,
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          })
      }
    ]
  }),
  columnHelper.group({
    header: "Doubles",
    columns: [
      {
        accessorKey: "doubles_wins",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Wins"
          })
      },
      {
        accessorKey: "doubles_losses",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Losses"
          })
      },
      {
        id: "doubles_percent",
        accessorFn: row => `${row.doubles_wins + row.doubles_losses ? percentage(row.doubles_wins, row.doubles_wins + row.doubles_losses) : 0}%`,
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          })
      }
    ]
  })
]

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])

const handleSelectRow = (row: TableRow<TournamentFinalistType>) => {
  navigateTo({
    name: "player",
    params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name}-${row.original.player.last_name}`) }
  })
}
</script>

<template>
  <client-only>
    <teleport to="#chart-container">
      <tournament-finalists-chart
        v-if="mdAndUp"
        :finalists
      />
    </teleport>
  </client-only>
  <u-table
    :data="finalists"
    :columns
    :loading="['idle', 'pending'].includes(status)"
    sticky
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    @select="handleSelectRow"
    :ui="{ tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
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
        No finalists found for {{ tournamentName }}
      </div>
    </template>
  </u-table>
</template>
