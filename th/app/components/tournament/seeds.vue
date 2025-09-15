<script setup lang="ts">
import { ArrayFilterTableHeader, CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UBadge, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

const {
  params: { id, name }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: results, status } = await useFetch<TournamentSeedType[]>("/api/tournaments/seeds", {
  key: `tournament-seeds-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<TournamentSeedType["teams"][number]>()

const gridColumns: TableColumn<TournamentSeedType["teams"][number]>[] = [
  { accessorKey: "seed", header: "Seed" },
  columnHelper.group({
    header: "Players",
    columns: [
      {
        id: "country",
        accessorFn: row => row.players.map(p => p.country.name),
        filterFn: "arrIncludesSome",
        header: ({ column }) =>
          h(ArrayFilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country"
          }),
        cell: ({ row }) =>
          row.original.players.map(p =>
            h(CountryLink, {
              country: p.country,
              class: "mx-auto"
            })
          )
      },
      {
        id: "name",
        accessorFn: row => row.players.map(p => `${p.last_name}, ${p.first_name}`),
        filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
        header: ({ column }) =>
          h(NameTableHeader, {
            column: column as Column<unknown>,
            label: "Name"
          }),
        cell: ({ row }) =>
          h(
            "div",
            {
              class: "flex flex-col items-center"
            },
            row.original.players.map(p =>
              h(
                ULink,
                {
                  to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name}-${p.last_name}`) } },
                  class: "hover-link default-link w-fit"
                },
                () => `${p.first_name} ${p.last_name}`
              )
            )
          )
      }
    ]
  })
]

const columns: TableColumn<TournamentSeedType>[] = [
  {
    accessorKey: "year",
    meta: { class: { td: "font-semibold" } },
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      })
  },
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.tour,
        color: getTourColour(row.original.tour)
      })
  },
  {
    accessorKey: "type",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Type",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.type,
        color: getMatchTypeColour(row.original.type)
      })
  },
  {
    accessorKey: "round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  }
]

const expanded = ref({})
const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="useSorted(results, (a, b) => b.year - a.year).value"
    :columns
    :loading="['idle', 'pending'].includes(status)"
    sticky
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ td: 'empty:p-0' }"
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
        No years when the top seeds reached the later rounds of {{ tournamentName }}
      </div>
    </template>

    <template #year-cell="{ row }">
      <div class="flex justify-center items-center gap-2">
        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="uIcons.chevronDoubleRight"
          :ui="{
            leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200',
            label: 'font-semibold'
          }"
          @click="row.toggleExpanded()"
        />

        <u-link
          :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
          class="hover-link font-semibold"
        >
          {{ row.original.year }}</u-link
        >
      </div>
    </template>

    <template #expanded="{ row }">
      <u-table
        :data="row.original.teams"
        :columns="gridColumns"
        class="w-fit mx-auto"
      />
    </template>
  </u-table>
</template>
