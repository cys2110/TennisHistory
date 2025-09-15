<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
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
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: entries, status } = await useFetch<EntryInterface[]>("/api/events/player-entries", {
  key: `event-player-entries-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<EntryInterface>()

const columns = computed<TableColumn<EntryInterface>[]>(() => [
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
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        accessorKey: "country.name",
        filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 1 : row.depth === 0))) {
            return h(CountryLink, {
              country: row.original.country,
              key: `${row.original.id}-${row.original.country.id}`,
              class: "mx-auto"
            })
          }
        }
      },
      {
        id: "name",
        accessorFn: row => `${row.last_name}, ${row.first_name}`,
        filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
        header: ({ column }) =>
          h(NameTableHeader, {
            column: column as Column<unknown>,
            label: "Name",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || (row.getIsGrouped() && (tours.value.length > 1 ? row.depth === 1 : row.depth === 0))) {
            return h(
              ULink,
              {
                key: row.original.id,
                to: {
                  name: "player",
                  params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) }
                },
                class: "hover-link default-link w-fit"
              },
              () => `${row.original.first_name} ${row.original.last_name}`
            )
          }
        }
      }
    ]
  }),
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
    accessorKey: "draw",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Draw",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.draw,
          color: getDrawColour(row.original.draw),
          class: "font-semibold"
        })
      }
    }
  },
  {
    id: "seed",
    accessorFn: row => (row.draw === "Main" ? row.seed : row.q_seed),
    sortUndefined: "last",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Seed" })
  },
  {
    id: "status",
    accessorFn: row =>
      row.draw === "Main" && row.status ? STATUSES[row.status].longName
      : row.draw === "Qualifying" && row.q_status ? STATUSES[row.q_status].longName
      : undefined,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    sortUndefined: "last",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Status", type: "alpha" })
  },
  {
    accessorKey: "rank",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Rank" })
    // cell: ({ row }) => {
    //   return tableMode.value === "ungrouped" || (!row.getIsGrouped() && row.original.rank)
    // }
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
        ["tour", "name"]
      : ["name"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="entries"
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
          :name="uIcons.caution"
          class="text-base"
        />
        No entries available for {{ tournamentName }} {{ year }}
      </div>
    </template>
  </u-table>
</template>
