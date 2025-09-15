<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, SortTableHeader, UBadge, UButton, ULink } from "#components"
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
const { data: winners, status } = await useFetch<TournamentAgeType[]>("/api/tournaments/winners-by-age", {
  key: `tournament-age-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentAgeType>()

const columns = computed<TableColumn<TournamentAgeType>[]>(() => [
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
    accessorKey: "player.tour",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Tour", type: "alpha" }),
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
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
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.length > 1 ? row.depth === 1 : row.depth === 0))) {
        return h(UBadge, {
          label: row.original.type,
          color: getMatchTypeColour(row.original.type),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "year",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Year" }),
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
  {
    id: "age",
    accessorFn: row => (row.age ? row.age.months * 30.4375 + row.age?.days : undefined),
    sortingFn: (rowA, rowB) => {
      const ageA = rowA.original.age
      const ageB = rowB.original.age

      if (!ageA) return 1
      if (!ageB) return -1

      if (ageA.months === ageB.months) {
        return ageA.days < ageB.days ? -1 : 1
      } else {
        return ageA.months < ageB.months ? -1 : 1
      }
    },
    aggregationFn: (leafRows, childRows) => {
      const totalDays = childRows
        .filter(row => row.original.age)
        .reduce((sum, row) => sum + row.original.age!.months * 30.4375 + (row.original.age?.days || 0), 0)
      const count = childRows.filter(row => row.original.age).length
      const averageDays = totalDays / count

      const years = Math.floor(averageDays / 365.25)
      const months = Math.floor((averageDays % 365.25) / 30.4375)
      const days = Math.floor((averageDays % 365.25) % 30.4375)

      return `Avg: ${years} years, ${months} months, ${days} days`
    },
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Age",
        type: "number"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return row.original.age ?
            `${Math.floor(row.original.age.months / 12)} years, ${row.original.age.months % 12} months, ${row.original.age.days} days`
          : "—"
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
  expand: tableMode.value === "grouped",
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping = computed(() =>
  tableMode.value === "grouped" ?
    tours.length === 1 ?
      ["type"]
    : ["player_tour", "type"]
  : []
)
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <client-only>
    <teleport to="#chart-container">
      <tournament-age-chart
        v-if="mdAndUp"
        :winners
      />
    </teleport>
  </client-only>
  <u-table
    :data="winners"
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
        No winners found for {{ tournamentName }}
      </div>
    </template>
  </u-table>
</template>
