<script setup lang="ts">
import { FilterTableHeader } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

useHead({ title: "Supervisors" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Supervisors",
  description: "A collection of tennis supervisors"
}))

// API call
const { data: supervisors, status } = await useFetch<PersonInterface[]>("/api/supervisors", {
  key: "supervisors",
  default: () => [],
  server: false
})

const columns: TableColumn<PersonInterface>[] = [
  {
    accessorKey: "last_name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Supervisor",
        type: "alpha"
      }),
    cell: ({ row }) => row.original.id,
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      return `Total: ${filteredRows.length}`
    }
  }
]

const columnFilters = ref([])

const handleSelectRow = async (row: TableRow<PersonInterface>) => {
  await navigateTo({ name: "supervisor", params: { id: kebabCase(row.original.id) } })
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
          :data="supervisors"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          v-model:column-filters="columnFilters"
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer' }"
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
                :name="icons.noSupervisor"
                class="text-base"
              />
              No supervisors found
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
