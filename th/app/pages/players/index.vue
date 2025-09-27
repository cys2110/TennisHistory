<script setup lang="ts">
import { CountryLink, TableCellGroup, TableHeaderGroup, TableHeaderInput, TableHeaderName, TableHeaderRange, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"
import ColouredBadge from "~/components/coloured-badge.vue"

useHead({ title: "Players" })
const currentYear = new Date().getFullYear()

// API call
const { data: players, status } = await useFetch<PlayerInterface[]>("/api/players", {
  key: "players",
  default: () => [],
  server: false
})

const columns: TableColumn<PlayerInterface>[] = [
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Tour" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { label: row.getValue("tour") as string, class: "mx-auto" })
      )
  },
  {
    id: "status",
    accessorFn: row => (row.max_year === currentYear ? "Active" : "Inactive"),
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Status" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "status" }, () =>
        h(ColouredBadge, { label: row.getValue("status") as string, class: "mx-auto" })
      )
  },
  {
    id: "country",
    accessorKey: "country.name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Country" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "country" }, () =>
        h(CountryLink, { country: row.original.country, class: "mx-auto", iconOnly: true })
      )
  },
  {
    id: "name",
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    header: ({ column }) => h(TableHeaderInput, { column: column as Column<unknown>, label: "Name" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return `${row.original.first_name} ${row.original.last_name}`
      }
    }
  },
  {
    accessorKey: "min_year",
    sortUndefined: "last",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "First Tournament Year" }),
    cell: ({ cell, row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return cell.getValue()
      }
    }
  },
  {
    accessorKey: "max_year",
    sortUndefined: "last",
    header: ({ column }) => h(TableHeaderRange, { column: column as Column<unknown>, label: "Last Tournament Year" }),
    cell: ({ cell, row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return cell.getValue()
      }
    }
  },
  {
    id: "coaches",
    accessorFn: row => row.coaches.map(coach => `${coach.last_name}, ${coach.first_name}`),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Coaches" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return row.original.coaches.map(coach =>
          h("div", { class: "flex items-center gap-1" }, [
            coach.labels.includes("Player")
              ? h(
                  ULink,
                  {
                    to: { name: "player", params: { id: coach.id, name: kebabCase(`${coach.first_name} ${coach.last_name}`) } },
                    class: "hover-link default-link w-fit"
                  },
                  `${coach.first_name} ${coach.last_name}`
                )
              : h("span", {}, `${coach.first_name} ${coach.last_name}`),
            coach.start_year
              ? coach.end_year
                ? coach.start_year === coach.end_year
                  ? `(${coach.start_year})`
                  : `(${coach.start_year}-${coach.end_year})`
                : `(${coach.start_year})-present`
              : null
          ])
        )
      }
    }
  }
]

const table = useTemplateRef("table")
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const handleSelectRow = async (row: TableRow<PlayerInterface>) => {
  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    await navigateTo({
      name: "player",
      params: {
        id: row.original.id,
        name: kebabCase(`${row.original.first_name} ${row.original.last_name}`)
      }
    })
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
            :icon="ICONS.sortAlpha"
            @click="table?.tableApi.resetSorting()"
            size="sm"
          />
          <u-button
            label="Reset Grouping"
            :icon="ICONS.ungroup"
            @click="table?.tableApi.resetGrouping()"
            size="sm"
          />
          <u-button
            label="Reset Filters"
            :icon="ICONS.noFilter"
            @click="table?.tableApi.resetColumnFilters()"
            size="sm"
          />
          <table-visibility
            v-if="table"
            :table="table!"
          />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <u-table
          ref="table"
          :data="players"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
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
            <table-loading-icon />
          </template>

          <template #empty>
            <table-empty-message
              :icon="ICONS.noTournament"
              message="No tournaments found"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
