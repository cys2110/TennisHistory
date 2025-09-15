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
  params: { id, name }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: players, status } = await useFetch<EntryInterface[]>("/api/tournaments/statuses", {
  key: `tournament-statuses-${id}`,
  query: { id },
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
    id: "status",
    accessorFn: row => STATUSES[row.status as keyof typeof STATUSES].longName,
    meta: { class: { td: "font-semibold" } },
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Status",
        type: "alpha"
      }),
    cell: ({ cell, row }) => {
      if (tableMode.value === "ungrouped" || row.getIsGrouped()) {
        return cell.getValue()
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
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.eid } },
            class: "hover-link default-link font-semibold"
          },
          () => row.original.year
        )
      }
    },
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
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
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour(row.original.tour)
        })
      }
    },
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 0) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[0]).length
        return `${uniqueStatuses[0]}s: ${count}`
      }
    }
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
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
          color: getMatchTypeColour(row.original.type)
        })
      }
    },
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 1) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[1]).length
        return `${uniqueStatuses[1]}s: ${count}`
      }
    }
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.players.map(player =>
              h(CountryLink, {
                country: player.country,
                key: `${row.original.year}-${player.id}-${player.country.id}`,
                class: "mx-auto"
              })
            )
          }
        },
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 2) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[2]).length
            return `${uniqueStatuses[2]}s: ${count}`
          }
        }
      },
      {
        id: "first_name",
        accessorFn: row => row.players.map(player => `${player.last_name}, ${player.first_name}`),
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
              row.original.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } },
                    class: "hover-link default-link w-fit"
                  },
                  () => `${player.first_name} ${player.last_name}`
                )
              )
            )
          }
        },
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 3) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[3]).length
            return `${uniqueStatuses[3]}s: ${count}`
          }
        }
      }
    ]
  })
])

const columnVisibility = ref({
  tour: tours.length > 1,
  expand: tableMode.value === "grouped"
})
const columnFilters = ref([])
const grouping = computed(() => (tableMode.value === "grouped" ? ["status"] : []))
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="players"
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
          :name="icons.noTournament"
          class="text-base"
        />
        No qualifiers, lucky losers, alternates or wild cards have won {{ tournamentName }}
      </div>
    </template>
  </u-table>
</template>
