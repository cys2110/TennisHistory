<script setup lang="ts">
import { CountryLink, FilterTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
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

const { viewMode } = useDefaults()
const {
  //@ts-ignore
  params: { id, name }
} = useRoute()
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: winners, status } = await useFetch<TournamentScoreStatsType[]>("/api/tournaments/scores-stats", {
  key: `tournament-scores-stats-${id}`,
  query: { id },
  default: () => []
})

const columnHelper = createColumnHelper<TournamentScoreStatsType>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns = computed<TableColumn<TournamentScoreStatsType>[]>(() => [
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
              icon: uIcons.chevronDoubleRight,
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
        label: "Type",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link font-semibold"
          },
          () => row.original.year
        )
      }
    }
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.team.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.team.map(player =>
              h(CountryLink, {
                key: player.country.id,
                country: player.country,
                class: "mx-auto"
              })
            )
          }
        }
      },
      {
        id: "first_name",
        accessorFn: row => row.team.map(player => player.first_name),
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
              row.original.team.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } },
                    class: "hover-link mx-auto w-fit"
                  },
                  () => player.first_name
                )
              )
            )
          }
        }
      },
      {
        id: "last_name",
        accessorFn: row => row.team.map(player => player.last_name),
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
              row.original.team.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } },
                    class: "hover-link mx-auto w-fit"
                  },
                  () => player.last_name
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
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Won"
          })
      },
      {
        accessorKey: "sets_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Lost"
          })
      },
      {
        id: "sets_pc",
        accessorFn: row => (row.sets_won + row.sets_lost ? percentage(row.sets_won, row.sets_won + row.sets_lost) : 0),
        aggregationFn: "mean",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          }),
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
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Won"
          })
      },
      {
        accessorKey: "games_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number),
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Lost"
          })
      },
      {
        id: "games_pc",
        accessorFn: row => (row.games_won + row.games_lost ? percentage(row.games_won, row.games_won + row.games_lost) : 0),
        aggregationFn: "mean",
        cell: row => `${Math.round(row.getValue() as number)}%`,
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          })
      }
    ]
  })
])

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping = computed(() =>
  tableMode.value === "grouped" ?
    tours.length > 1 ?
      ["tour", "type"]
    : ["type"]
  : []
)
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <div v-if="viewMode === 'cards'">
    <u-page-grid v-if="winners.length || status === 'pending'">
      <u-card
        v-if="winners.length"
        v-for="winner in winners"
        :key="`${winner.year}-${winner.tour}-${winner.type}`"
        :ui="{
          root: `ring-${getTourColour([winner.tour])} 2xl:grid-cols-4 flex flex-col`,
          body: 'flex-1 text-sm text-center',
          footer: 'flex justify-center'
        }"
      >
        <template #header>
          <div class="flex justify-between font-semibold text-sm">
            <div class="flex flex-col">
              <player-link
                v-for="player in winner.team"
                :key="player.id"
                :player
              />
            </div>
            <div class="flex items-center gap-2">
              <u-badge
                :label="winner.tour"
                :color="getTourColour([winner.tour])"
              />
              <u-badge
                :label="winner.type"
                :color="winner.type === 'Singles' ? 'singles' : 'doubles'"
              />
            </div>
          </div>
        </template>

        <div class="flex flex-col">
          <div class="grid grid-cols-3">
            <div />
            <div>Sets</div>
            <div>Games</div>
          </div>
          <div class="grid grid-cols-3">
            <div>Won</div>
            <div class="font-semibold">{{ winner.sets_won }}</div>
            <div class="font-semibold">{{ winner.games_won }}</div>
          </div>
          <div class="grid grid-cols-3">
            <div>Lost</div>
            <div class="font-semibold">{{ winner.sets_lost }}</div>
            <div class="font-semibold">{{ winner.games_lost }}</div>
          </div>
          <div class="grid grid-cols-3">
            <div>Percentage</div>
            <div class="font-semibold"
              >{{ winner.sets_won + winner.sets_lost ? percentage(winner.sets_won, winner.sets_won + winner.sets_lost) : 0 }}%</div
            >
            <div class="font-semibold"
              >{{ winner.games_won + winner.games_lost ? percentage(winner.games_won, winner.games_won + winner.games_lost) : 0 }}%</div
            >
          </div>
        </div>

        <template #footer>
          <event-buttons
            :tournament="{ id: Number(id) as number, name: name as string, tours: [winner.tour] }"
            :year="winner.year"
            :id="winner.id"
          />
        </template>
      </u-card>

      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :message="`No winners found for ${tournamentName}`"
      :icon="icons.noTournament"
    />
  </div>
  <u-table
    v-else
    :data="winners"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No winners found for ${tournamentName}`"
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
