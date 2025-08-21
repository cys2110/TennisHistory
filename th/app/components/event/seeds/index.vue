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

const { eid, year } = useRoute().params as { eid: string; year: string }
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { viewMode, tableMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

// API call
const { data: seeds, status } = await useFetch<SeedInterface[]>("/api/events/seeds", {
  key: `event-seeds-${eid}`,
  query: { id: eid },
  default: () => []
})

const columnHelper = createColumnHelper<SeedInterface>()

const columns = computed<TableColumn<SeedInterface>[]>(() => [
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
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (
        tableMode.value === "ungrouped" ||
        (row.getIsGrouped() && ((tours.length > 1 && row.depth === 1) || (tours.length < 2 && row.depth === 0)))
      ) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "draw",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Draw",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (
        tableMode.value === "ungrouped" ||
        (row.getIsGrouped() && ((tours.length > 1 && row.depth === 2) || (tours.length < 2 && row.depth === 1)))
      ) {
        return h(UBadge, {
          label: row.original.draw,
          color: row.original.draw === "Main" ? "main" : "qualifying",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "seed",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Seed"
      }),
    cell: ({ row, cell }) => (tableMode.value === "ungrouped" || !row.getIsGrouped() ? cell.getValue() : undefined)
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
                country: player.country,
                key: `${player.id}-${player.country.id}`,
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
        id: "rank",
        accessorFn: row => row.team.map(player => player.rank),
        sortingFn: (rowA, rowB, columnId) =>
          Math.min(...(rowA.getValue(columnId) as number[])) < Math.min(...(rowB.getValue(columnId) as number[])) ? -1 : 1,
        aggregationFn: (leafRows, childRows) => {
          const ranks = childRows.map(row => row.original.team.map(player => player.rank)).flat()
          if (ranks.length === 0) {
            return undefined
          } else {
            const sortedRanks = ranks.sort((a, b) => (a ?? 0) - (b ?? 0))
            return `${sortedRanks[0]}-${sortedRanks[sortedRanks.length - 1]}`
          }
        },
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Rank (at event)"
          }),
        cell: ({ cell, row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              "div",
              {
                class: "flex flex-col"
              },
              row.original.team.map(player => h("div", {}, [player.rank]))
            )
          } else {
            return cell.getValue()
          }
        }
      }
    ]
  }),
  {
    accessorKey: "rank2",
    aggregationFn: "extent",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Rank (at draw)"
      }),
    cell: ({ cell, row }) => {
      return row.getIsGrouped() ? `${(cell.getValue() as number[])[0]}-${(cell.getValue() as number[])[1]}` : cell.getValue()
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
        ["tour", "type", "draw"]
      : ["type", "draw"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <dashboard-subpanel
    id="seeds"
    title="Seeds"
    :icon="icons.seeds"
  >
    <template #right>
      <event-seeds-chart
        v-if="seeds.length && mdAndUp"
        :seeds
      />
    </template>

    <u-table
      v-if="viewMode === 'list'"
      :data="seeds"
      :columns
      :loading="status === 'pending'"
      sticky
      :empty="`No seeds in ${tournament?.name} ${year}`"
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

    <u-page-grid
      v-else-if="seeds.length || status === 'pending'"
      class="2xl:grid-cols-4"
    >
      <u-card
        v-if="seeds.length"
        v-for="seed in seeds"
        :key="`${seed.tour}-${seed.draw}-${seed.type}-${seed.seed}`"
        :ui="{
          root: `ring-${getTourColour([seed.tour])}`,
          header: 'flex items-center justify-between'
        }"
      >
        <template #header>
          <div class="font-bold">{{ seed.seed }}</div>
          <div class="flex items-center gap-2">
            <u-badge
              :label="seed.tour"
              :color="getTourColour([seed.tour])"
            />
            <u-badge
              :label="seed.type"
              :color="seed.type === 'Singles' ? 'singles' : 'doubles'"
            />
            <u-badge
              :label="seed.draw"
              :color="seed.draw === 'Main' ? 'main' : 'qualifying'"
            />
          </div>
        </template>

        <div class="flex items-center justify-between">
          <player-link
            v-for="player in seed.team"
            :key="player.id"
            :player
          />
        </div>
      </u-card>

      <loading-base
        v-else
        v-for="n in 10"
        :key="n"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noPeople"
      :message="`No seeds in ${tournament?.name} ${year}`"
    />
  </dashboard-subpanel>
</template>
