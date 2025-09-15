<script setup lang="ts">
import { ArrayFilterTableHeader, ColouredBadge, CountryLink, FilterTableHeader, SortTableHeader, UButton, UDropdownMenu, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, createColumnHelper, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })
useHead({ title: () => `Results Archive ${get(year)}` })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "ItemPage",
  name: "Results Archive",
  description: `Events which took place in ${get(year)}`
}))

// API call
const { data: events, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `results-archive-${year}`,
  query: { year },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<EventInterface>()

const columns = computed<TableColumn<EventInterface>[]>(() => [
  columnHelper.group({
    id: "tournament",
    columns: [
      {
        accessorKey: "tournament.name",
        meta: { class: { th: "z-40", td: "whitespace-normal md:whitespace-nowrap" } },
        sortUndefined: "last",
        filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Tournament",
            type: "alpha"
          }),
        cell: ({ row, cell }) =>
          h(
            "div",
            {
              class: "flex flex-col items-center"
            },
            [
              h(
                ULink,
                {
                  class: "hover-link default-link font-semibold",
                  to: {
                    name: "tournament",
                    params: {
                      id: row.original.tournament.id,
                      name: kebabCase(cell.getValue() as string)
                    }
                  }
                },
                () => cell.getValue()
              ),
              ...(lgAndUp.value && row.original.sponsor_name ? [row.original.sponsor_name] : [])
            ]
          )
      }
    ],
    footer: ({ table }) => "Total: " + table.getRowCount().toLocaleString()
  }),
  columnHelper.group({
    id: "types",
    columns: [
      {
        accessorKey: "levels",
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Level"
          }),
        cell: ({ row }) =>
          h(
            "div",
            {
              class: "flex flex-col items-center gap-1 lg:gap-2"
            },
            row.original.levels.map(level =>
              h(ColouredBadge, {
                label: level,
                size: "md"
              })
            )
          ),
        footer: ({ table }) =>
          h(
            "div",
            { class: "text-atp" },
            `Tour: ${table.getFilteredRowModel().rows.filter(row => row.original.categories[0] || (row.original.categories[1] && !ATP_CHALLENGER_CATEGORIES.includes(row.original.categories[1]))).length}`
          )
      },
      {
        id: "categories",
        accessorFn: row => row.categories.filter(Boolean),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Category"
          }),
        cell: ({ row }) =>
          h(
            "div",
            {
              class: "flex flex-col gap-1 items-center"
            },
            row.original.categories.map((category, index) => {
              if (category) {
                return h(
                  ULink,
                  {
                    key: `${row.original.id}-${category}`,
                    to: {
                      name: "category",
                      params: { id: kebabCase(category) }
                    },
                    class: `hover-link ${tourColourMapping[index]}-link`
                  },
                  () => category
                )
              }
            })
          ),
        footer: ({ table }) =>
          h(
            "div",
            { class: "text-atp" },
            `Challenger: ${table.getFilteredRowModel().rows.filter(row => row.original.categories[1] && ATP_CHALLENGER_CATEGORIES.includes(row.original.categories[1])).length}`
          )
      }
    ],
    footer: ({ table }) =>
      h(
        "div",
        {
          class: "text-atp"
        },
        `ATP: ${table.getFilteredRowModel().rows.filter(row => row.original.tours.includes("ATP")).length}`
      )
  }),
  columnHelper.group({
    id: "dates",
    columns: [
      {
        id: "dates",
        accessorFn: row =>
          row.dates
            .map(date => date[0])
            .filter(Boolean)
            .map(date => getDate(date!)),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Dates", type: "number" }),
        cell: ({ row }) =>
          h(
            "div",
            {
              class: "flex flex-col items-center"
            },
            row.original.dates.map(([start, end], index) => {
              if (start && end) {
                const startDate = getDate(start)
                const endDate = getDate(end)

                return h(
                  "div",
                  {
                    key: `${row.original.id}-date-${index}`,
                    class: `text-${tourColourMapping[index]}`
                  },
                  lgAndUp.value ? dateTimeFormat.formatRange(startDate, endDate) : shortDateFormat.formatRange(startDate, endDate)
                )
              }
            })
          ),
        footer: ({ table }) => {
          const filteredRows = table.getFilteredRowModel().rows

          return h(
            "div",
            {
              class: "flex items-center justify-evenly text-wta"
            },
            [
              h(
                "div",
                `Tour: ${filteredRows.filter(row => row.original.categories[0] || (row.original.categories[2] && !WTA_CHALLENGER_CATEGORIES.includes(row.original.categories[2]))).length}`
              ),
              h(
                "div",
                `Challenger: ${filteredRows.filter(row => row.original.categories[2] && WTA_CHALLENGER_CATEGORIES.includes(row.original.categories[2])).length}`
              )
            ]
          )
        }
      }
    ],
    footer: ({ table }) =>
      h(
        "div",
        {
          class: "text-wta"
        },
        `WTA: ${table.getFilteredRowModel().rows.filter(row => row.original.tours.includes("WTA")).length}`
      )
  }),
  columnHelper.group({
    id: "surface",
    columns: [
      {
        accessorKey: "surface.id",
        sortUndefined: "last",
        filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
        header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Surface", type: "alpha" }),
        cell: ({ row, cell }) => {
          if (row.original.surface) {
            return h(
              ULink,
              {
                class: "hover-link default-link",
                to: {
                  name: "surface",
                  params: {
                    id: kebabCase(row.original.surface.id)
                  }
                }
              },
              () => cell.renderValue()
            )
          } else {
            return cell.renderValue()
          }
        }
      }
    ],
    footer: ({ table }) =>
      h(
        "div",
        {
          class: "text-men"
        },
        `ITF (M): ${table.getFilteredRowModel().rows.filter(row => row.original.tours.includes("ITF (M)")).length}`
      )
  }),
  columnHelper.group({
    id: "location",
    header: lgAndUp.value ? "Location" : "",
    columns: [
      {
        id: "venue",
        accessorFn: row => row.venues?.map(venue => venue.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludesSome",
        meta: { class: { td: "whitespace-normal" } },
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Venue"
          }),
        cell: ({ row }) => {
          if (row.original.venues.length) {
            return h(
              "div",
              {
                class: "flex flex-col items-center"
              },
              row.original.venues.map(venue =>
                h(
                  ULink,
                  {
                    class: "hover-link default-link",
                    to: {
                      name: "venue",
                      params: {
                        id: kebabCase(venue.id)
                      }
                    }
                  },
                  () => (venue.name ? `${venue.name}, ${venue.city}` : venue.city)
                )
              )
            )
          } else {
            return "Various"
          }
        }
      },
      {
        id: "country",
        accessorFn: row => row.venues?.map(venue => venue.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country"
          }),
        cell: ({ row }) => {
          if (row.original.venues[0]) {
            return h(CountryLink, {
              country: row.original.venues[0].country,
              class: "mx-auto"
            })
          } else {
            return "Various"
          }
        }
      }
    ],
    footer: ({ table }) =>
      h(
        "div",
        {
          class: "text-women"
        },
        `ITF (W): ${table.getFilteredRowModel().rows.filter(row => row.original.tours.includes("ITF (W)")).length}`
      )
  }),
  {
    id: "navigation",
    cell: ({ row }) => {
      const dropdownItems = EVENT_PAGES.map(page => ({
        ...page,
        to: {
          name: page.name,
          params: {
            id: row.original.tournament.id,
            name: kebabCase(row.original.tournament.name),
            year: row.original.year,
            eid: row.original.id
          }
        }
      }))

      return h(
        // @ts-ignore
        UDropdownMenu,
        {
          items: dropdownItems,
          size: "sm"
        },
        {
          default: () =>
            h(UButton, {
              icon: uIcons.ellipsis,
              size: "lg",
              variant: "link"
            })
        }
      )
    }
  }
])

const columnFilters = ref([])
const columnVisibility = computed(() => ({
  venue: get(lgAndUp)
}))
const columnPinning = ref({
  left: ["tournament_name"],
  right: []
})
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
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-table
          :data="events"
          :columns
          :loading="['pending', 'idle'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          v-model:columnFilters="columnFilters"
          v-model:column-visibility="columnVisibility"
          v-model:column-pinning="columnPinning"
          render-fallback-value="Various"
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
                :name="icons.noCalendar"
                class="text-base"
              />
              No events took place in {{ year }}
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
