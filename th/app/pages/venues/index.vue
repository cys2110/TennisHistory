<script setup lang="ts">
import { CountryLink, FilterTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

useHead({ title: "Venues" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Venues",
  description: "A collection of tennis venues"
}))

// API call
const { data: venues, status } = await useFetch<VenueInterface[]>("/api/venues", {
  key: `venues`,
  default: () => [],
  server: false
})

const columns: TableColumn<VenueInterface>[] = [
  {
    accessorKey: "country.name",
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
            label: "Country",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "city",
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
            label: "City",
            type: "alpha"
          })
        ]
      ),
    footer: ({ table }) => {
      const filtered = table.getFilteredRowModel().rows
      return `Total: ${filtered.length}`
    }
  },
  {
    id: "name",
    accessorFn: row => row.name ?? row.city,
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Venue",
        type: "alpha"
      }),
    aggregationFn: "uniqueCount"
  }
]

const columnFilters = ref([])

const handleSelectRow = async (row: TableRow<VenueInterface>) => {
  if (!row.getIsGrouped()) {
    await navigateTo({ name: "venue", params: { id: kebabCase(row.original.id) } })
  } else if (row.getIsGrouped() && row.groupingColumnId === "country_name") {
    await navigateTo({ name: "country", params: { id: row.original.country.id, name: kebabCase(row.original.country.name) } })
  }
}

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")
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
          :data="venues"
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
                :name="icons.noPeople"
                class="text-base"
              />
              No umpires found
            </div>
          </template>

          <template #country_name-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'country_name'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />

              <country-link
                v-if="(row.getIsGrouped() && row.groupingColumnId === 'country_name') || (!grouping.includes('country_name') && !row.getIsGrouped())"
                :country="row.original.country"
                :icon-only="false"
              />
            </div>
          </template>

          <template #city-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'city'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />

              <div
                v-if="(row.getIsGrouped() && row.groupingColumnId === 'city') || (!grouping.includes('city') && !row.getIsGrouped())"
                class="text-center"
              >
                {{ row.original.city }}
              </div>
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
