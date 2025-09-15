<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, SortTableHeader, UBadge, UButton, ULink } from "#components"
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
  params: { id, name }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: events, status } = await useFetch<TournamentLowestRankedType[]>("/api/tournaments/lowest-ranked", {
  key: `tournament-lowest-ranked-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentLowestRankedType>()

const columns = computed<TableColumn<TournamentLowestRankedType>[]>(() => [
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
    accessorKey: "round",
    meta: { class: { td: "font-semibold" } },
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Round", type: "alpha" })
  },
  {
    accessorKey: "tour",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Tour", type: "alpha" }),
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: cell.getValue() as string,
          color: getTourColour(cell.getValue() as TourType),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Type", type: "alpha" }),
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.type,
          color: getMatchTypeColour(row.original.type),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "rank",
    aggregationFn: "max",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Rank", type: "number" })
  },
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Year",
        type: "number"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link default-link w-fit"
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
        filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
        header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Country", type: "alpha" }),
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
        id: "player_name",
        accessorFn: row => `${row.player.last_name}, ${row.player.first_name}`,
        filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
        header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Name" }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              ULink,
              {
                to: {
                  name: "player",
                  params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name}-${row.original.player.last_name}`) }
                },
                class: "hover-link default-link w-fit"
              },
              () => `${row.original.player.first_name} ${row.original.player.last_name}`
            )
          }
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
  <client-only>
    <teleport to="#chart-container">
      <tournament-lowest-rank-chart
        v-if="mdAndUp"
        :events
      />
    </teleport>
  </client-only>
  <u-table
    :data="events"
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
          :name="icons.noPlayer"
          class="text-base"
        />
        No players found for {{ tournamentName }}
      </div>
    </template>
  </u-table>
</template>
