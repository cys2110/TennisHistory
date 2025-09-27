<script setup lang="ts">
import { ColouredBadge, CountryLink, TableCellGroup, TableHeaderFilter, TableHeaderGroup, TableHeaderName, TableHeaderSort, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"
import type { RouteLocationRaw } from "vue-router"

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const lgAndUp = breakpoints.greaterOrEqual("lg")
const toast = useToast()

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })
useHead({ title: () => `Results Archive ${get(year)}` })

// API call
const { data: events, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `results-archive-${year}`,
  query: { year },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<EventInterface>()
const columns = computed<TableColumn<EventInterface>[]>(() => [
  {
    id: "Tournament",
    accessorKey: "tournament.name",
    meta: { class: { th: "z-40" } },
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderFilter, { column: column as Column<unknown>, label: "Tournament" }),
    cell: ({ row, cell }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h("div", { class: "flex flex-col items-center" }, [
          h(
            ULink,
            {
              class: "hover-link default-link font-semibold",
              to: {
                name: "tournament",
                params: { id: row.original.tournament.id, name: kebabCase(cell.getValue() as string) }
              }
            },
            () => cell.getValue()
          ),
          ...(lgAndUp.value && row.original.sponsor_name ? [row.original.sponsor_name] : [])
        ])
      }
    },
    footer: ({ table }) => `Total: ${table.getRowCount()}`
  },
  {
    id: "level",
    accessorKey: "levels",
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    filterFn: "arrIncludesSome",
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Level" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "level" }, () =>
        h(
          "div",
          { class: "flex flex-col items-center gap-1 lg:gap-2" },
          row.original.levels.map(level => h(ColouredBadge, { label: level }))
        )
      )
  },
  {
    id: "category",
    accessorFn: row => row.categories.filter(Boolean),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    sortUndefined: "last",
    filterFn: "arrIncludesSome",
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Category" }),
    cell: ({ row }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "category" }, () =>
        h(
          "div",
          { class: "flex flex-col" },
          row.original.categories.map((category, index) => {
            if (category) {
              return h("div", { key: `${row.original.id}-${category}`, class: `text-${tourColourMapping[index]}` }, category)
            }
          })
        )
      )
  },
  {
    id: "dates",
    accessorFn: row =>
      row.dates
        .map(date => date[0])
        .filter(Boolean)
        .map(date => getDate(date!)),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    header: ({ column }) => h(TableHeaderSort, { column: column as Column<unknown>, label: "Dates", type: "number" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return row.original.dates.map(([start, end], index) => {
          if (start && end) {
            const startDate = getDate(start)
            const endDate = getDate(end)

            return h(
              "div",
              { key: `${row.original.id}-date-${index}`, class: `text-${tourColourMapping[index]}` },
              lgAndUp.value ? dateTimeFormat.formatRange(startDate, endDate) : shortDateFormat.formatRange(startDate, endDate)
            )
          }
        })
      }
    }
  },
  {
    id: "Surface",
    accessorKey: "surface.id",
    sortUndefined: "last",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Surface" }),
    cell: ({ row, cell }) =>
      h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "Surface" }, () => cell.renderValue())
  },
  columnHelper.group({
    id: "location",
    header: "Location",
    columns: [
      {
        id: "venue",
        accessorFn: row => row.venues?.map(venue => (venue.name ? `${venue.name}, ${venue.city}` : venue.city)),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludesSome",
        header: ({ column }) => h(TableHeaderFilter, { column: column as Column<unknown>, label: "Venue" }),
        cell: ({ row }) => {
          if (!row.getIsGrouped() || grouping.value.length === 0) {
            if (row.original.venues.length) {
              return row.original.venues.map(venue =>
                h("div", { key: `${row.original.id}-${venue.id}` }, venue.name ? `${venue.name}, ${venue.city}` : venue.city)
              )
            } else {
              return "Various"
            }
          }
        }
      },
      {
        id: "country",
        accessorFn: row => useArrayUnique(row.venues?.map(venue => venue.country.name)).value,
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludesSome",
        header: ({ column }) => h(TableHeaderGroup, { column: column as Column<unknown>, label: "Country" }),
        cell: ({ row }) =>
          h(TableCellGroup, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "country" }, () => {
            if (row.original.venues[0]) {
              return h(CountryLink, {
                country: row.original.venues[0].country,
                class: "mx-auto",
                iconOnly: false
              })
            } else {
              return "Various"
            }
          })
      }
    ]
  }),
  {
    id: "supervisors",
    accessorFn: row => row.supervisors.map(s => `${s.first_name} ${s.last_name}`),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Supervisor(s)" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return row.original.supervisors.map(supervisor =>
          h("div", { key: `${row.original.id}-${supervisor.id}` }, `${supervisor.first_name} ${supervisor.last_name}`)
        )
      }
    }
  },
  {
    id: "umpires",
    accessorFn: row => row.umpires.map(u => `${u.last_name}, ${u.first_name}`),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) => h(TableHeaderName, { column: column as Column<unknown>, label: "Umpire" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return row.original.umpires.map(umpire => h("div", { key: `${row.original.id}-${umpire.id}` }, `${umpire.last_name}, ${umpire.first_name}`))
      }
    }
  }
])

const handleRowSelect = (row: TableRow<EventInterface>) => {
  toast.clear()

  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    toast.add({
      title: row.original.tournament.name,
      description: row.original.sponsor_name,
      duration: Infinity,
      progress: false,
      orientation: "horizontal",
      actions: EVENT_PAGES.map(page => ({
        icon: page.icon,
        label: page.label,
        onClick: e => {
          toast.clear()
          navigateTo({
            name: page.name,
            params: {
              id: row.original.tournament.id,
              name: kebabCase(row.original.tournament.name),
              year: row.original.year,
              eid: row.original.id
            }
          } as RouteLocationRaw)
        }
      }))
    })
  }
}

const table = useTemplateRef("table")
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})
const columnPinning = ref({
  left: ["Tournament"],
  right: []
})

onBeforeUnmount(() => toast.clear())
onBeforeRouteLeave(() => toast.clear())
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
          <filter-select-all-years v-model="year" />
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
          :data="events"
          :columns
          :loading="['pending', 'idle'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :grouping="grouping"
          v-on:update:grouping="grouping = $event"
          :grouping-options="grouping_options"
          v-model:column-pinning="columnPinning"
          @select="handleRowSelect"
          render-fallback-value="Various"
          :ui="{ tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
        >
          <template #loading>
            <table-loading-icon />
          </template>

          <template #empty>
            <table-empty-message
              :icon="ICONS.noCalendar"
              :message="`No events took place in ${year}`"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
