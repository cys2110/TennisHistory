<script setup lang="ts">
import { CountryLink, TableHeaderFilter } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

useHead({ title: "Countries" })

// API call
const { data: countries, status } = await useFetch<CountryInterface[]>("/api/countries", {
  key: "countries",
  default: () => [],
  server: false
})

const columns: TableColumn<CountryInterface>[] = [
  {
    accessorKey: "name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderFilter, { column: column as Column<unknown>, label: "Country", type: "alpha" }),
    cell: ({ row }) => h(CountryLink, { country: row.original, iconOnly: false, class: "mx-auto" }),
    footer: ({ table }) => `Total: ${table.getRowCount()}`
  }
]

const handleSelectRow = async (row: TableRow<CountryInterface>) => {
  await navigateTo({ name: "country", params: { id: row.original.id, name: kebabCase(row.original.name) } })
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
      </template>
      <template #body>
        <u-table
          :data="countries"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer' }"
        >
          <template #loading>
            <table-loading-icon />
          </template>

          <template #empty>
            <table-empty-message
              :icon="ICONS.noCountries"
              message="No countries found"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
