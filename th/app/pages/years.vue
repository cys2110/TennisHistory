<script setup lang="ts">
import { FilterTableHeader, UIcon } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

// @ts-ignore
// const id = useRouteQuery<number>("year", new Date().getFullYear().toString(), { transform: Number })
const id = ref(2025)
useHead({ title: () => id.value })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

interface APIResponse {
  type: string
  id: string | { low: number }
  name: string
  first_name: string
  last_name: string
  country: CountryInterface
}

const { data, status } = await useFetch<APIResponse[]>("/api/years", {
  query: { id },
  default: () => [],
  server: false
})

const columns: TableColumn<APIResponse>[] = [
  {
    id: "type",
    accessorFn: row => capitalCase(row.type),
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Type",
        type: "alpha"
      })
  },
  {
    id: "result",
    cell: ({ row }) => {
      if (row.original.first_name) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [h(UIcon, { name: getFlagCode(row.original.country) }), h("div", {}, `${row.original.first_name} ${row.original.last_name}`)]
        )
      } else {
        return row.original.name
      }
    }
  }
]

const handleSelectRow = async (row: TableRow<APIResponse>) => {
  const pageName = row.original.first_name ? "player" : "tournaament"

  const params =
    pageName === "player" ?
      { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) }
      // @ts-ignore
    : { id: row.original.id.low, name: kebabCase(row.original.name) }

  // @ts-ignore
  await navigateTo({
    name: pageName,
    params
  })
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

        <!-- <u-dashboard-toolbar>
          <filter-select-all-years v-model="id as number" />
        </u-dashboard-toolbar> -->
      </template>

      <template #body>
        <u-table
          :data
          :columns
          :loading="status === 'pending'"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
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
                :name="icons.noSearch"
                class="text-base"
              />
              No results found
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
