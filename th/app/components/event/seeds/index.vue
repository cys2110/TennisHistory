<script setup lang="ts">
import { ArrayFilterTableHeader, CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
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

const {
  params: { eid, year }
} = useRoute("event")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: seeds, status } = await useFetch<SeedInterface[]>("/api/events/seeds", {
  key: `event-seeds-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<SeedInterface>()

const columns = computed<TableColumn<SeedInterface>[]>(() => [
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
    accessorKey: "draw",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Draw",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 2 : row.depth === 1))) {
        return h(UBadge, {
          label: row.original.draw,
          color: getDrawColour(row.original.draw),
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
          h(ArrayFilterTableHeader, {
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
        id: "name",
        accessorFn: row => row.team.map(player => `${player.last_name}, ${player.first_name}`),
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
              row.original.team.map(player =>
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
    accessorKey: "rank",
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
const columnVisibility = computed(() => ({
  tour: tours.value?.length > 1,
  expand: tableMode.value === "grouped"
}))
const grouping = computed(() => {
  return (
    tableMode.value === "grouped" ?
      tours.value.length > 1 ?
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
    class="max-h-200"
  >
    <template #right>
      <event-seeds-chart
        v-if="seeds.length && mdAndUp"
        :seeds
      />
    </template>

    <u-table
      :data="seeds"
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
      :ui="{ td: 'empty:p-0' }"
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
            :name="icons.noPeople"
            class="text-base"
          />
          No seeds found for {{ tournamentName }} {{ year }}
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
