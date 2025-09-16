<script setup lang="ts">
import { SortTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const smAndDown = breakpoints.smallerOrEqual("sm")

const columns: TableColumn<SurfaceInterface>[] = [{ id: "image" }, { accessorKey: "environment" }, { accessorKey: "surface" }, { id: "navigation" }]
</script>

<template>
  <u-table
    :data="SURFACES_LIST"
    :columns
    empty="No surfaces found"
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
      <sort-table-header
        :column
        label="Environment"
        type="alpha"
      />
    </template>

    <template #surface-header="{ column }">
      <sort-table-header
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
</template>
