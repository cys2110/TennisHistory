<script setup lang="ts">
import { FilterTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

useHead({ title: "Categories" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Categories",
  description: "A collection of categories of tennis tournaments"
}))

// API call
const { data: categories, status } = await useFetch<CategoryType[]>("/api/categories", {
  key: "categories",
  default: () => [],
  server: false
})

const columns: TableColumn<CategoryType>[] = [
  {
    id: "tour",
    accessorFn: row =>
      ATP_CATEGORIES.includes(row) ? "ATP"
      : WTA_CATEGORIES.includes(row) ? "WTA"
      : ITF_MEN_CATEGORIES.includes(row) ? "ITF (M)"
      : ITF_WOMEN_CATEGORIES.includes(row) ? "ITF (W)"
      : undefined,
    sortUndefined: "last",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Tour",
            type: "alpha"
          })
        ]
      ),
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel().rows
      return `Total: ${filteredRows.length}`
    }
  },
  {
    id: "level",
    accessorFn: row =>
      ATP_CHALLENGER_CATEGORIES.includes(row) || WTA_CHALLENGER_CATEGORIES.includes(row) ? "Challenger"
      : ITF_MEN_CATEGORIES.includes(row) || ITF_WOMEN_CATEGORIES.includes(row) ? "ITF"
      : "Tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Level",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "category",
    accessorFn: row => row,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    aggregationFn: "uniqueCount",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Category",
        type: "alpha"
      })
  }
]

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<CategoryType>) => {
  if (!row.getIsGrouped()) {
    await navigateTo({ name: "category", params: { id: kebabCase(row.original) } })
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
          v-model:column-filters="columnFilters"
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
              No categories found
            </div>
          </template>

          <template #tour-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'tour'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />

              <template v-if="row.getValue('tour')">
                <coloured-badge
                  v-if="(row.getIsGrouped() && row.groupingColumnId === 'tour') || (!grouping.includes('tour') && !row.getIsGrouped())"
                  :label="row.getValue('tour')"
                  class="mx-auto"
                />
              </template>
            </div>
          </template>

          <template #level-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'level'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />

              <template v-if="row.getValue('level')">
                <coloured-badge
                  v-if="(row.getIsGrouped() && row.groupingColumnId === 'level') || (!grouping.includes('level') && !row.getIsGrouped())"
                  :label="row.getValue('level')"
                  class="mx-auto"
                />
              </template>
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
