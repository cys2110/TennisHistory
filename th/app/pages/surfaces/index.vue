<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

const { viewMode } = useDefaults()
useHead({ title: "Surfaces" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const smAndDown = breakpoints.smallerOrEqual("sm")

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
  },
  { id: "navigation" }
]

const columnFilters = ref([])
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
          v-if="viewMode === 'list'"
          :data="SURFACES_LIST"
          :columns
          empty="No surfaces found"
          v-model:columnFilters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          class="w-fit mx-auto"
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

          <template #navigation-cell="{ row }">
            <u-button
              :to="{ name: 'surface', params: { id: kebabCase(row.original.id) } }"
              label="Go to..."
              :size="smAndDown ? 'xs' : 'sm'"
              :trailing-icon="icons.court"
            />
          </template>
        </u-table>

        <u-page-grid
          v-else
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto"
        >
          <u-page-card
            v-for="surface in SURFACES_LIST"
            :key="surface.id"
            highlight
            highlight-color="joint"
            :to="{ name: 'surface', params: { id: kebabCase(surface.id) } }"
            :ui="{ title: 'flex justify-center items-center gap-2', body: 'w-full' }"
          >
            <template #title>
              <u-avatar
                :src="`/surfaces/${surface.surface}.jpg`"
                :alt="surface.id"
              />
              <span>{{ surface.id }}</span>
            </template>
          </u-page-card>
        </u-page-grid>
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ SURFACES_LIST.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
