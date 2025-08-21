<script setup lang="ts">
import { CountryLink, FilterTableHeader, InputTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { tableMode } = useDefaults()
const {
  ui: { icons }
} = useAppConfig()

const { data: venues, status } = await useFetch<VenueInterface[]>("/api/venues/table", {
  key: `venues-table`,
  default: () => []
})

const columns = computed<TableColumn<VenueInterface>[]>(() => [
  ...(tableMode.value === "grouped" ?
    [
      {
        id: "expand",
        cell: ({ row }: { row: any }) => {
          if (row.getIsGrouped()) {
            return h(UButton, {
              icon: icons.chevronDoubleRight,
              size: "xs",
              variant: "link",
              color: "neutral",
              onClick: () => row.toggleExpanded(),
              ui: { leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200" }
            })
          }
        }
      }
    ]
  : []),
  {
    accessorKey: "country.name",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Country"
      }),
    cell: ({ row }) => {
      if ((row.getIsGrouped() && row.depth === 0) || tableMode.value === "ungrouped") {
        return h(CountryLink, {
          country: row.original.country,
          iconOnly: false,
          class: "mx-auto"
        })
      }
    }
  },
  {
    accessorKey: "city",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "City"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
        return cell.getValue()
      }
    },
    footer: ({ table }) => {
      if (tableMode.value === "ungrouped") {
        const filtered = table.getFilteredRowModel().rows
        return `Total: ${filtered.length}`
      }
    }
  },
  {
    id: "name",
    accessorFn: row => row.name ?? row.city,
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Venue"
      }),
    cell: ({ cell, row }) => {
      if (tableMode.value === "grouped" && row.getIsGrouped()) {
        return cell.getValue()
      } else {
        if (cell.getValue()) {
          return h(
            ULink,
            {
              class: "hover-link",
              to: { name: "venue", params: { id: kebabCase(row.original.id) } }
            },
            () => cell.getValue()
          )
        }
      }
    },
    aggregationFn: "uniqueCount"
  }
])

const grouping = computed(() => (tableMode.value === "grouped" ? ["country_name", "city"] : []))

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})

const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="venues"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No venues found"
    v-model:columnFilters="columnFilters"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="grouping"
    :grouping-options="grouping_options"
    :ui="{
      root: 'w-fit min-w-1/2 mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0'
    }"
  />
</template>
