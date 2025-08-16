<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/vue-table"

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })

// API call
const { data: events, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `results-archive`,
  query: { year },
  default: () => []
})

const columnHelper = createColumnHelper<EventInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<EventInterface>[] = [
  columnHelper.group({
    id: "1",
    columns: [{ accessorKey: "year" }],
    footer: ({ table }) => "Total: " + table.getRowCount().toLocaleString()
  }),
  columnHelper.group({
    id: "2",
    columns: [{ id: "tournament", accessorFn: row => row.tournament?.name, sortUndefined: "last", filterFn: "equals" }]
  }),
  columnHelper.group({
    id: "3",
    columns: [
      {
        id: "category",
        accessorFn: row => {
          const { category, atp_category, wta_category, men_category, women_category } = row
          return [category, atp_category, wta_category, men_category, women_category].filter(Boolean)
        },
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludes"
      }
    ],
    footer: ({ table }) => {
      return (
        "ITF (M): " +
        table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => {
            if (row.original.tours.includes("Men")) acc++
            return acc
          }, 0)
          .toLocaleString()
      )
    }
  }),
  columnHelper.group({
    id: "4",
    columns: [
      {
        id: "dates",
        accessorFn: row => {
          const { start_date, atp_start_date, wta_start_date, men_start_date, women_start_date } = row
          const dates = [start_date, atp_start_date, wta_start_date, men_start_date, women_start_date].filter(Boolean)
          const stringDates = dates.map(date => `${date!.year}-${date!.month}-${date!.day}`)
          return stringDates
        }
      }
    ],
    footer: ({ table }) => {
      return (
        "ITF (W): " +
        table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => {
            if (row.original.tours.includes("Women")) acc++
            return acc
          }, 0)
          .toLocaleString()
      )
    }
  }),
  columnHelper.group({
    header: "Surface",
    columns: [
      {
        id: "environment",
        accessorFn: row => row.surface?.environment,
        filterFn: "equals",
        footer: ({ table }) => {
          return (
            "Tour: " +
            table
              .getFilteredRowModel()
              .rows.reduce((acc, row) => {
                if (row.original.category || (row.original.atp_category && !ATP_CHALLENGER_CATEGORIES.includes(row.original.atp_category))) acc++
                return acc
              }, 0)
              .toLocaleString()
          )
        }
      },
      {
        id: "surface",
        accessorFn: row => row.surface?.surface,
        filterFn: "equals",
        footer: ({ table }) => {
          return (
            "Challenger: " +
            table
              .getFilteredRowModel()
              .rows.reduce((acc, row) => {
                if (row.original.atp_category && ATP_CHALLENGER_CATEGORIES.includes(row.original.atp_category)) acc++
                return acc
              }, 0)
              .toLocaleString()
          )
        }
      }
    ],
    footer: ({ table }) => {
      return (
        "ATP: " +
        table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => {
            if (row.original.tours.includes("ATP")) acc++
            return acc
          }, 0)
          .toLocaleString()
      )
    }
  }),
  columnHelper.group({
    header: "Location",
    columns: [
      {
        id: "venue",
        accessorFn: row => row.venues?.map(venue => venue.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludes",
        footer: ({ table }) => {
          return (
            "Tour: " +
            table
              .getFilteredRowModel()
              .rows.reduce((acc, row) => {
                if (row.original.category || (row.original.wta_category && !WTA_CHALLENGER_CATEGORIES.includes(row.original.wta_category))) acc++
                return acc
              }, 0)
              .toLocaleString()
          )
        }
      },
      {
        id: "country",
        accessorFn: row => row.venues?.map(venue => venue.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        sortUndefined: "last",
        filterFn: "arrIncludes",
        footer: ({ table }) => {
          return (
            "Challenger: " +
            table
              .getFilteredRowModel()
              .rows.reduce((acc, row) => {
                if (row.original.wta_category && WTA_CHALLENGER_CATEGORIES.includes(row.original.wta_category)) acc++
                return acc
              }, 0)
              .toLocaleString()
          )
        }
      }
    ],
    footer: ({ table }) => {
      return (
        "WTA: " +
        table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => {
            if (row.original.tours.includes("WTA")) acc++
            return acc
          }, 0)
          .toLocaleString()
      )
    }
  })
]

const columnFilters = ref([])

const tours = ["atp", "wta", "men", "women"]

const getCategoryKeys = (row: EventInterface) => tours.filter(tour => row[`${tour}_category` as keyof EventInterface])

const getDateKeys = (row: EventInterface) => tours.filter(tour => row[`${tour}_start_date` as keyof EventInterface])
</script>

<template>
  <page-wrapper>
    <u-table
      :columns
      :data="events"
      :loading="status === 'pending'"
      sticky
      empty="No events found"
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues()
      }"
      v-model:columnFilters="columnFilters"
      render-fallback-value="Various"
      class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent"
    >
      <template #year-header="{ column }">
        <div class="w-fit flex justify-center items-center gap-1 mx-auto">
          <sort-table-header
            :column
            type="number"
          />
          <filter-select-all-years
            v-model="year"
            size="sm"
            header
          />
        </div>
      </template>
      <template #year-cell="{ cell, row }">
        <u-link
          class="hover-link"
          :to="{
            name: 'event',
            params: {
              id: row.original.tournament.id,
              name: kebabCase(row.original.tournament.name),
              year: cell.renderValue() as string,
              eid: row.original.id
            }
          }"
        >
          {{ cell.renderValue() }}
        </u-link>
      </template>
      <template #tournament-header="{ column }">
        <filter-table-header
          :column
          label="Tournament"
          type="alpha"
        />
      </template>
      <template #tournament-cell="{ row, cell }">
        <u-link
          class="hover-link font-semibold"
          :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(cell.renderValue() as string) } }"
        >
          {{ cell.renderValue() }}
        </u-link>
        <div v-if="row.original.sponsor_name">
          {{ row.original.sponsor_name }}
        </div>
      </template>
      <template #category-header="{ column }">
        <filter-table-header
          :column
          label="Category"
          type="alpha"
        />
      </template>
      <template #category-cell="{ row }">
        <u-link
          v-if="row.original.category"
          :to="{ name: 'category', params: { id: kebabCase(row.original.category) } }"
          class="hover-link"
        >
          {{ row.original.category }}
        </u-link>
        <div
          v-else-if="getCategoryKeys(row.original).length > 0"
          class="flex flex-col gap-1 items-center"
        >
          <u-link
            v-for="tour in getCategoryKeys(row.original)"
            :key="tour"
            :to="{ name: 'category', params: { id: kebabCase(row.original[`${tour}_category` as keyof EventInterface]! as string) } }"
            :class="`${tour}-link w-fit`"
          >
            {{ row.original[`${tour}_category` as keyof EventInterface] }}
          </u-link>
        </div>
        <template v-else>—</template>
      </template>
      <template #dates-header="{ column }">
        <sort-table-header
          :column
          label="Dates"
          type="number"
        />
      </template>
      <template #dates-cell="{ row }">
        <template v-if="row.original.start_date && row.original.end_date">
          {{ dateTimeFormat.formatRange(getDate(row.original.start_date), getDate(row.original.end_date)) }}
        </template>
        <div v-else>
          <div
            v-for="tour in getDateKeys(row.original)"
            :key="`date-${tour}`"
            :class="`text-${tour}`"
          >
            {{
              dateTimeFormat.formatRange(
                getDate(row.original[`${tour}_start_date` as keyof EventInterface] as DateType),
                getDate(row.original[`${tour}_end_date` as keyof EventInterface] as DateType)
              )
            }}
          </div>
        </div>
      </template>
      <template #environment-header="{ column }">
        <filter-table-header
          :column
          label="Environment"
          type="alpha"
        />
      </template>
      <template #surface-header="{ column }">
        <filter-table-header
          :column
          label="Surface"
          type="alpha"
        />
      </template>
      <template #surface-cell="{ row, cell }">
        <u-link
          v-if="cell.getValue()"
          class="hover-link"
          :to="{ name: 'surface', params: { id: kebabCase(row.original.surface.id) } }"
        >
          {{ cell.getValue() }}
        </u-link>
        <template v-else>{{ cell.renderValue() }}</template>
      </template>
      <template #venue-header="{ column }">
        <filter-table-header
          :column
          label="Venue"
          type="alpha"
        />
      </template>
      <template #venue-cell="{ row, cell }">
        <div
          v-if="(cell.getValue() as string[]).length"
          class="flex flex-col"
        >
          <u-link
            v-for="venue in row.original.venues"
            :key="venue.id"
            class="hover-link w-fit mx-auto"
            :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
          >
            {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
          </u-link>
        </div>
        <template v-else>Various</template>
      </template>
      <template #country-header="{ column }">
        <filter-table-header
          :column
          label="Country"
          type="alpha"
        />
      </template>
      <template #country-cell="{ row }">
        <country-link
          v-if="row.original.venues[0]"
          :country="row.original.venues[0]?.country"
          class="mx-auto"
        />
        <template v-else>Various</template>
      </template>
    </u-table>
  </page-wrapper>
</template>
