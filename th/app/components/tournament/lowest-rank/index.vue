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
const { data, status } = await useFetch<TournamentLowestRankedType[]>("/api/tournaments/lowest-ranked", {
  key: `tournament-lowest-ranked-${id}`,
  query: { id },
  default: () => []
})

// Group results by round
const groupedResults = computed(() => {
  const rounds: Record<string, TournamentLowestRankedType[]> = {}
  data.value.forEach(result => {
    if (!rounds[result.round]) {
      rounds[result.round] = []
    }
    rounds[result.round]!.push(result)
  })

  return rounds
})

const gridColumns: TableColumn<TournamentLowestRankedType>[] = [
  { accessorKey: "tour", header: "Tour" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "rank", header: "Rank" },
  { id: "year", header: "Year" },
  { id: "players", header: "Players" }
]
const gridColumnVisibility = ref({
  tour: tours.length > 1
})

const flattenedResults = computed(() => {
  const newResults: TournamentFlattenedLowestRankedType[] = []
  data.value.forEach(result => {
    result.players.forEach(player => {
      newResults.push({
        ...result,
        year: player.year,
        id: player.eid,
        player: {
          id: player.id,
          first_name: player.first_name,
          last_name: player.last_name,
          country: player.country,
          tour: result.tour
        }
      })
    })
  })
  return newResults
})

const columnHelper = createColumnHelper<TournamentFlattenedLowestRankedType>()

// @ts-ignore
const columns = computed<TableColumn<TournamentFlattenedLowestRankedType>[]>(() => [
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
    accessorKey: "round",
    meta: { class: { td: "font-semibold" } },
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      }),
    footer: ({ table }) => `Lowest Rank: ${table.getColumn("rank")?.getFacetedMinMaxValues()?.[1].toLocaleString() ?? ""}`
  },
  {
    accessorKey: "tour",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour([row.original.tour])
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
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles"
        })
      }
    }
  },
  { accessorKey: "rank", aggregationFn: "max", header: "Rank" },
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
            class: "hover-link"
          },
          () => row.original.year
        )
      }
    }
  },
  columnHelper.group({
    header: "Player",
    columns: [
      {
        accessorKey: "player.country.name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(CountryLink, {
              country: row.original.player.country,
              class: "mx-auto"
            })
          }
        }
      },
      {
        accessorKey: "player.first_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              ULink,
              {
                to: {
                  name: "player",
                  params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
                },
                class: "hover-link"
              },
              () => cell.getValue()
            )
          }
        }
      },
      {
        accessorKey: "player.last_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              ULink,
              {
                to: {
                  name: "player",
                  params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
                },
                class: "hover-link"
              },
              () => cell.getValue()
            )
          }
        },
        footer: ({ table }) => {
          const rankColumn = table.getFilteredRowModel().rows.map(row => row.getValue("rank"))
          return `Average Rank: ${useAverage(rankColumn as number[]).value.toLocaleString()}`
        }
      }
    ]
  })
])

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping = computed(() => (tableMode.value === "grouped" ? ["round"] : []))
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <div v-if="viewMode === 'cards'">
    <u-page-grid
      v-if="Object.keys(groupedResults).length || status === 'pending'"
      class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2"
    >
      <u-card
        v-if="Object.keys(groupedResults).length"
        v-for="round in Object.entries(groupedResults)"
        :key="round[0]"
        :ui="{
          root: 'ring-joint',
          header: 'font-semibold'
        }"
      >
        <template #header>{{ round[0] }}</template>

        <u-table
          :data="round[1]"
          :columns="gridColumns"
          v-model:column-visibility="gridColumnVisibility"
          class="w-fit mx-auto"
        >
          <template #tour-cell="{ row }">
            <u-badge
              class="font-semibold"
              :label="row.original.tour"
              :color="getTourColour([row.original.tour])"
            />
          </template>

          <template #type-cell="{ row }">
            <u-badge
              class="font-semibold"
              :label="row.original.type"
              :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
            />
          </template>

          <template #year-cell="{ row }">
            <div class="flex flex-col items-center">
              <u-link
                v-for="player in row.original.players"
                :key="player.id"
                :to="{ name: 'event', params: { id, name, year: player.year, eid: player.eid } }"
                class="hover-link"
              >
                {{ player.year }}
              </u-link>
            </div>
          </template>

          <template #players-cell="{ row }">
            <div class="flex flex-col items-center mx-10">
              <player-link
                v-for="player in row.original.players"
                :key="player.id"
                :player
              />
            </div>
          </template>
        </u-table>
      </u-card>

      <loading-player
        v-else
        v-for="_ in 4"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.seeds"
      :message="`No players found for ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="flattenedResults"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No players found for ${tournamentName}`"
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
