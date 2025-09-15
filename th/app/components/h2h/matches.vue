<script setup lang="ts">
import { FilterTableHeader, MatchScoreItem, NameTableHeader, PlayerLink, SortTableHeader, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column } from "@tanstack/vue-table"

const { h2h } = defineProps<{ h2h: { p1: PlayerInterface; p2: PlayerInterface; p1Wins: number; p2Wins: number } }>()

const {
  params: { p1Id, p2Id }
} = useRoute("h2h-players")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

interface APIResponse extends EventInterface {
  match: MatchInterface
}

const { data: events, status } = await useFetch<APIResponse[]>("/api/h2h/matches", {
  query: { p1Id, p2Id },
  default: () => [],
  server: false
})

const columns: TableColumn<APIResponse>[] = [
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Year",
        type: "number"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: {
            name: "event",
            params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name), year: row.original.year, eid: row.original.id }
          },
          class: "hover-link default-link w-fit mx-auto"
        },
        () => row.original.year
      )
  },
  {
    id: "winner",
    accessorFn: row => `${row.match.winner.last_name}, ${row.match.winner.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Winner"
      }),
    cell: ({ row }) =>
      h(PlayerLink, {
        player: row.original.match.winner,
        centred: true
      })
  },
  {
    accessorKey: "tournament.name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tournament",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: { name: "tournament", params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } },
          class: "hover-link default-link w-fit mx-auto"
        },
        () => row.original.tournament.name
      )
  },
  {
    accessorKey: "match.round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  },
  {
    accessorKey: "surface.id",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Surface",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: { name: "surface", params: { id: kebabCase(row.original.surface.id) } },
          class: "hover-link default-link w-fit mx-auto"
        },
        () => row.original.surface.id
      )
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) =>
      h(MatchScoreItem, {
        tour: h2h.p1.tour,
        type: "Singles",
        sets: row.original.match.sets,
        tournament: row.original.tournament,
        id: row.original.id,
        year: row.original.year,
        match_no: row.original.match.match_no,
        incomplete: row.original.match.incomplete,
        centred: true,
        stats: row.original.match.stats
      })
  }
]
</script>

<template>
  <dashboard-subpanel
    title="Matches"
    :icon="icons.upcoming"
  >
    <u-table
      :data="events"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
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
            :name="icons.noH2H"
            class="text-base"
          />
          No matches found between {{ h2h.p1.first_name }} {{ h2h.p1.last_name }} and {{ h2h.p2.first_name }} {{ h2h.p2.last_name }}.
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
