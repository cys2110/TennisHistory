<script setup lang="ts">
import { ArrayFilterTableHeader, CountryLink, FilterTableHeader, NameTableHeader, UBadge, UButton, ULink } from "#components"
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
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: teams, status } = await useFetch<EntryInfoInterface[]>("/api/events/entry-info", {
  key: `event-entry-info-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<EntryInfoInterface>()

const columns = computed<TableColumn<EntryInfoInterface>[]>(() => [
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
    accessorKey: "label",
    meta: { class: { td: "font-semibold" } },
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Entry Info",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
        return cell.getValue()
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
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
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
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 2 : row.depth === 1))) {
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
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 3 : row.depth === 2))) {
        return h(UBadge, {
          label: row.original.draw,
          color: getDrawColour(row.original.draw),
          class: "font-semibold"
        })
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
        filterFn: "arrIncludesSome",
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
      }
    ]
  }),
  {
    id: "reason",
    header: "Rank/Reason",
    accessorFn: row => {
      if (row.rank) {
        if (row.status === "PR") return `P${row.rank}`
        return row.rank
      }

      if (row.team[0]?.reason && row.team[0].reason !== "teammate")
        return `${row.type === "Singles" ? "" : `${row.team[0].last_name} - `} ${row.team[0].reason}`
      if (row.team[1]?.reason && row.team[1].reason !== "teammate") return `${row.team[1].last_name} - ${row.team[1].reason}`
      if (row.team_reason) return row.team_reason
    },
    cell: ({ cell, row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return cell.getValue()
      }
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
        ["label", "tour", "type", "draw"]
      : ["label", "type", "draw"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
const sorting = ref([
  { id: "label", desc: false },
  { id: "tour", desc: false },
  { id: "type", desc: true },
  { id: "draw", desc: false }
])
</script>

<template>
  <dashboard-subpanel
    id="entry-info"
    title="Entry Information"
    :icon="uIcons.info"
    class="max-h-200"
  >
    <template #right>
      <event-entry-info-chart
        v-if="teams.length && mdAndUp"
        :teams
      />
    </template>

    <u-table
      :data="teams"
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
      v-model:sorting="sorting"
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
            :name="uIcons.caution"
            class="text-base"
          />
          No entry information available for {{ tournamentName }} {{ year }}
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
