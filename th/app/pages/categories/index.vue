<script setup lang="ts">
import { ColouredBadge, FilterTableHeader, GroupedCell, GroupFilterTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

useHead({ title: "Categories" })
const { icons } = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Categories",
  description: "A collection of categories of tennis tournaments"
}))

// API call
const { data: categories, status } = await useFetch<EventInterface[]>("/api/categories", {
  key: "categories",
  default: () => [],
  server: false
})

const columns: TableColumn<EventInterface>[] = [
  {
    accessorKey: "tour",
    sortUndefined: "last",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(GroupFilterTableHeader, { column: column as Column<unknown>, label: "Tour", type: "alpha" }),
    cell: ({ row }) =>
      h(GroupedCell, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { label: row.getValue("tour") as string, class: "mx-auto" })
      ),
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      return `Total: ${filteredRows.length}`
    }
  },
  {
    accessorKey: "level",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(GroupFilterTableHeader, { column: column as Column<unknown>, label: "Level", type: "alpha" }),
    cell: ({ row }) =>
      h(GroupedCell, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "level" }, () =>
        h(ColouredBadge, { label: row.getValue("level") as string, class: "mx-auto" })
      )
  },
  {
    accessorKey: "category",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    aggregationFn: "uniqueCount",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Category", type: "alpha" }),
    cell: ({ row, cell }) => (row.getIsGrouped() ? `${cell.getValue()} categories` : cell.getValue())
  }
]

const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<EventInterface>) => {
  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    await navigateTo({ name: "category", params: { id: kebabCase(row.original.category) } })
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Reset Sorting"
            :icon="icons.sortAlpha"
            @click="table?.tableApi.resetSorting()"
            size="sm"
          />
          <u-button
            label="Reset Grouping"
            :icon="icons.ungroup"
            @click="table?.tableApi.resetGrouping()"
            size="sm"
          />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <u-table
          ref="table"
          :data="categories"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :grouping="grouping"
          v-on:update:grouping="grouping = $event"
          :grouping-options="grouping_options"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
        >
          <template #loading>
            <loading-icon />
          </template>

          <template #empty>
            <empty-message message="No categories found" />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
