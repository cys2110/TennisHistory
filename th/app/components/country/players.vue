<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, SortTableHeader, UButton, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const {
  params: { id, name }
} = useRoute("country")

const countryName = useState<string>("country-name")

interface APIResponseType extends PlayerInterface {
  start_date?: DateType
  end_date?: DateType
}

// API call
const { data: results, status } = await useFetch<APIResponseType[]>("/api/countries/players", {
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<APIResponseType>[]>(() => [
  {
    accessorKey: "tour",
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
      )
  },
  {
    id: "country",
    accessorFn: row => row.country.name,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Country",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(CountryLink, {
          country: row.original.country,
          class: "mx-auto"
        })
      }
    }
  },
  {
    id: "name",
    accessorFn: row => `${row.last_name}, ${row.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Name"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return `${row.original.first_name} ${row.original.last_name}`
      }
    }
  },
  {
    id: "start",
    accessorFn: row => (row.start_date ? `${row.start_date.year}-${row.start_date.month}-${row.start_date.day}` : undefined),
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Start of Representation",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if ((!row.getIsGrouped() || grouping.value.length === 0) && row.original.start_date) {
        return dateTimeFormat.format(getDate(row.original.start_date))
      }
    }
  },
  {
    id: "end",
    accessorFn: row => (row.end_date ? `${row.end_date.year}-${row.end_date.month}-${row.end_date.day}` : undefined),
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "End of Representation",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if ((!row.getIsGrouped() || grouping.value.length === 0) && row.original.end_date) {
        return dateTimeFormat.format(getDate(row.original.end_date))
      }
    }
  }
])

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<APIResponseType>) => {
  await navigateTo({ name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } })
}
</script>

<template>
  <dashboard-subpanel
    :title="`Players who represent or have represented ${countryName || capitalCase(name as string)}`"
    :icon="icons.player"
    id="players"
  >
    <template #right>
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
    </template>

    <u-table
      ref="table"
      :data="results"
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
            :name="icons.noPlayer"
            class="text-base"
          />
          No players found
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
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'tour') || (!grouping.includes('tour') && !row.getIsGrouped())"
            :label="row.original.tour"
            class="mx-auto"
          />
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
