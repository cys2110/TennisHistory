<script setup lang="ts">
import { CountryLink, FilterTableHeader, SortTableHeader, UBadge } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

const { viewMode } = useDefaults()
const {
  //@ts-ignore
  params: { id }
} = useRoute()
const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: countries, status } = await useFetch<TournamentCountryType[]>("/api/tournaments/country-winners", {
  key: `tournament-country-${id}`,
  query: { id },
  default: () => []
})

const columnHelper = createColumnHelper<TournamentCountryType>()

const columns: TableColumn<TournamentCountryType>[] = [
  {
    accessorKey: "country.name",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Country",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(CountryLink, {
        country: row.original.country,
        iconOnly: false,
        class: "mx-auto"
      }),
    footer: ({ table }) => `Total: ${table.getRowCount()}`
  },
  columnHelper.group({
    header: "Individual Winners",
    columns: [
      columnHelper.group({
        id: "distinct_atp",
        header: () => h(UBadge, { color: "atp", label: "ATP", class: "font-semibold" }),
        columns: [
          {
            accessorKey: "atp_singles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            accessorKey: "atp_doubles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "distinct_total_atp",
            accessorFn: row => row.atp_singles_wins + row.atp_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      }),
      columnHelper.group({
        id: "distinct_wta",
        header: () => h(UBadge, { color: "wta", label: "WTA", class: "font-semibold" }),
        columns: [
          {
            accessorKey: "wta_singles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            accessorKey: "wta_doubles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "distinct_total_wta",
            accessorFn: row => row.wta_singles_wins + row.wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      }),
      columnHelper.group({
        id: "distinct_total",
        header: () => h(UBadge, { color: "joint", label: "Total", class: "font-semibold" }),
        columns: [
          {
            id: "total_singles",
            accessorFn: row => row.atp_singles_wins + row.wta_singles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "total_doubles",
            accessorFn: row => row.atp_doubles_wins + row.wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "distinct_all",
            accessorFn: row => row.atp_singles_wins + row.atp_doubles_wins + row.wta_singles_wins + row.wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      })
    ]
  }),
  columnHelper.group({
    header: "Total Wins",
    columns: [
      columnHelper.group({
        id: "all_atp",
        header: () => h(UBadge, { color: "atp", label: "ATP", class: "font-semibold" }),
        columns: [
          {
            accessorKey: "total_atp_singles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            accessorKey: "total_atp_doubles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "total_atp",
            accessorFn: row => row.total_atp_singles_wins + row.total_atp_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      }),
      columnHelper.group({
        id: "total_wta",
        header: () => h(UBadge, { color: "wta", label: "WTA", class: "font-semibold" }),
        columns: [
          {
            accessorKey: "total_wta_singles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            accessorKey: "total_wta_doubles_wins",
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "total_wta",
            accessorFn: row => row.total_wta_singles_wins + row.total_wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      }),
      columnHelper.group({
        id: "all_total",
        header: () => h(UBadge, { color: "joint", label: "Total", class: "font-semibold" }),
        columns: [
          {
            id: "all_singles",
            accessorFn: row => row.total_atp_singles_wins + row.total_wta_singles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "singles",
                    label: "Singles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "all_doubles",
            accessorFn: row => row.total_atp_doubles_wins + row.total_wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "doubles",
                    label: "Doubles",
                    class: "font-semibold"
                  })
                ]
              )
          },
          {
            id: "all_all",
            accessorFn: row => row.total_atp_singles_wins + row.total_atp_doubles_wins + row.total_wta_singles_wins + row.total_wta_doubles_wins,
            header: ({ column }) =>
              h(
                "div",
                {
                  class: "flex items-center gap-2"
                },
                [
                  h(SortTableHeader, {
                    column: column as Column<unknown>,
                    type: "number"
                  }),
                  h(UBadge, {
                    color: "active",
                    label: "Total",
                    class: "font-semibold"
                  })
                ]
              )
          }
        ]
      })
    ]
  })
]

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
</script>

<template>
  <div v-if="viewMode === 'cards'">
    <u-page-grid v-if="countries.length || status === 'pending'">
      <u-card
        v-if="countries.length"
        v-for="country in countries"
        :key="country.country.id"
        class="ring-joint"
      >
        <template #header>
          <country-link
            :country="country.country"
            :icon-only="false"
          />
        </template>

        <dashboard-subpanel title="Individual Winners">
          <div class="text-center text-sm">
            <div class="grid grid-cols-4 gap-2">
              <div></div>
              <div>Singles</div>
              <div>Doubles</div>
              <div>Total</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="ATP"
                color="atp"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.atp_singles_wins }}</div>
              <div class="font-semibold">{{ country.atp_doubles_wins }}</div>
              <div class="font-semibold">{{ country.atp_singles_wins + country.atp_doubles_wins }}</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="WTA"
                color="wta"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.wta_singles_wins }}</div>
              <div class="font-semibold">{{ country.wta_doubles_wins }}</div>
              <div class="font-semibold">{{ country.wta_singles_wins + country.wta_doubles_wins }}</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="Total"
                color="joint"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.atp_singles_wins + country.wta_singles_wins }}</div>
              <div class="font-semibold">{{ country.atp_doubles_wins + country.wta_doubles_wins }}</div>
              <div class="font-semibold">{{
                country.atp_singles_wins + country.atp_doubles_wins + country.wta_singles_wins + country.wta_doubles_wins
              }}</div>
            </div>
          </div>
        </dashboard-subpanel>

        <dashboard-subpanel title="Total Wins">
          <div class="text-center text-sm">
            <div class="grid grid-cols-4 gap-2">
              <div></div>
              <div>Singles</div>
              <div>Doubles</div>
              <div>Total</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="ATP"
                color="atp"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.total_atp_singles_wins }}</div>
              <div class="font-semibold">{{ country.total_atp_doubles_wins }}</div>
              <div class="font-semibold">{{ country.total_atp_singles_wins + country.total_atp_doubles_wins }}</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="WTA"
                color="wta"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.total_wta_singles_wins }}</div>
              <div class="font-semibold">{{ country.total_wta_doubles_wins }}</div>
              <div class="font-semibold">{{ country.total_wta_singles_wins + country.total_wta_doubles_wins }}</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <u-badge
                label="Total"
                color="joint"
                class="w-fit mx-auto"
              />
              <div class="font-semibold">{{ country.total_atp_singles_wins + country.total_wta_singles_wins }}</div>
              <div class="font-semibold">{{ country.total_atp_doubles_wins + country.total_wta_doubles_wins }}</div>
              <div class="font-semibold">{{
                country.total_atp_singles_wins + country.total_atp_doubles_wins + country.total_wta_singles_wins + country.total_wta_doubles_wins
              }}</div>
            </div>
          </div>
        </dashboard-subpanel>
      </u-card>

      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noCountries"
      :message="`No countries represented by winners of ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="countries"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No countries represented by winners of ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165', td: 'empty:p-0' }"
  />
</template>
