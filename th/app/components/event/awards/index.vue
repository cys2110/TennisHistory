<script setup lang="ts">
import { FilterTableHeader, RangeTableHeader, UBadge, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
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
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  key: `event-awards-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<RoundInterface>[]>(() => [
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
    accessorKey: "round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  },
  {
    accessorKey: "pm",
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Prize Money"
      }),
    cell: ({ row }) =>
      isDefined(row.original.pm) && row.original.currency ?
        row.original.pm.toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
      : undefined
  },
  {
    accessorKey: "points",
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Points"
      }),
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined)
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
        ["tour", "type"]
      : ["type"]
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
    id="awards"
    title="Awards"
    :icon="icons.awards"
    class="max-h-200"
  >
    <template #right>
      <event-awards-chart
        v-if="awards.length && mdAndUp"
        :awards
      />
    </template>

    <u-table
      :data="awards"
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
            :name="icons.noAwards"
            class="text-base"
          />
          No awards found for {{ tournamentName }} {{ year }}
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
