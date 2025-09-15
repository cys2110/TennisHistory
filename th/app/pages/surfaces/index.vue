<script setup lang="ts">
import { FilterTableHeader } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

useHead({ title: "Surfaces" })

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Surfaces",
  description: "A collection of tennis court surfaces"
}))

const columns: TableColumn<SurfaceInterface>[] = [
  { id: "image" },
  { accessorKey: "environment" },
  {
    accessorKey: "surface",
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      return `Total: ${filteredRows.length}`
    }
  }
]

const columnFilters = ref([])

const handleSelectRow = async (row: TableRow<SurfaceInterface>) => {
  await navigateTo({ name: "surface", params: { id: kebabCase(row.original.id) } })
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
          :data="SURFACES_LIST"
          :columns
          sticky
          v-model:column-filters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/4 mx-auto', tbody: '[&>tr]:cursor-pointer' }"
        >
          <template #image-cell="{ row }">
            <u-avatar
              :src="`/surfaces/${row.original.surface}.jpg`"
              :alt="row.original.surface"
              size="sm"
            />
          </template>

          <template #environment-header="{ column }">
            <filter-table-header
              :column
              label="Environment"
              type="alpha"
            />
          </template>

          <template #surface-header="{ column }">
            <filter-table-header
              :column
              label="Surface"
              type="alpha"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
