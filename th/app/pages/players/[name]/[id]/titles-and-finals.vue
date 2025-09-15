<script setup lang="ts">
import { FilterTableHeader, RangeTableHeader, SortTableHeader, UButton, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "titles-and-finals" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const {
  params: { id }
} = useRoute("titles-and-finals")

const selection = ref<"Titles" | "Finals">("Titles")

const { data: events, status } = await useFetch<EventInterface[]>("/api/players/titles-and-finals", {
  key: `titles-and-finals-${id}`,
  query: { id, selection },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<EventInterface>[]>(() => [
  {
    accessorKey: "type",
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
            label: "S/D",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "level",
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
            label: "Tournament Type",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "category",
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
            label: "Category",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "tournament.name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tournament",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            to: { name: "tournament", params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } },
            class: "hover-link default-link w-fit"
          },
          () => row.original.tournament.name
        )
      }
    }
  },
  {
    accessorKey: "year",
    header: ({ column }) => h(RangeTableHeader, { column: column as Column<unknown>, label: "Year" }),
    aggregationFn: "extent"
  },
  {
    id: "date",
    accessorFn: row => `${row.end_date.year}-${row.end_date.month}-${row.end_date.day}`,
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Date", type: "alpha" }),
    cell: ({ row }) => dateTimeFormat.format(getDate(row.original.end_date))
  }
])

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<EventInterface>) => {
  await navigateTo({
    name: "event",
    params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name), year: row.original.year, eid: row.original.id }
  })
}
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <u-button
        label="Reset Sorting"
        :icon="icons.sortAlpha"
        @click="table?.tableApi.resetSorting()"
        size="sm"
      />

      <u-radio-group
        v-model="selection"
        :items="['Titles', 'Finals']"
        orientation="horizontal"
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
      :data="events"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
      v-model:column-filters="columnFilters"
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
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
            :name="icons.noTournament"
            class="text-base"
          />
          No tournaments found
        </div>
      </template>

      <template #type-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'type'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'type') || (!grouping.includes('type') && !row.getIsGrouped())"
            :label="row.getValue('type')"
            class="mx-auto"
          />
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
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'level') || (!grouping.includes('level') && !row.getIsGrouped())"
            :label="row.getValue('level')"
            class="mx-auto"
          />
        </div>
      </template>

      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'category'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'category') || (!grouping.includes('category') && !row.getIsGrouped())"
            :to="{ name: 'category', params: { id: kebabCase(row.getValue('category') as string) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("category") }}
          </u-link>
        </div>
      </template>
    </u-table>
  </player-wrapper>
</template>
