<script setup lang="ts">
import { CountryLink, FilterTableHeader, RangeTableHeader, UBadge, ULink } from "#components"
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
const { data: finalists, status } = await useFetch<TournamentFinalistType[]>("/api/tournaments/finalists", {
  key: `tournament-finalists-${id}`,
  query: { id },
  default: () => []
})

const columnHelper = createColumnHelper<TournamentFinalistType>()

const columns: TableColumn<TournamentFinalistType>[] = [
  columnHelper.group({
    header: "Player",
    columns: [
      {
        accessorKey: "player.tour",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Tour",
            type: "alpha"
          }),
        cell: ({ row }) =>
          h(UBadge, {
            label: row.original.player.tour,
            color: getTourColour([row.original.player.tour])
          }),
        footer: ({ table }) => `Total: ${table.getRowCount()}`
      },
      {
        accessorKey: "player.country.name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => h(CountryLink, { country: row.original.player.country, class: "mx-auto" })
      },
      {
        accessorKey: "player.first_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
            type: "alpha"
          }),
        cell: ({ cell, row }) =>
          h(
            ULink,
            {
              key: row.original.player.id,
              to: {
                name: "player",
                params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
              },
              class: "hover-link w-fit"
            },
            () => cell.getValue()
          )
      },
      {
        accessorKey: "player.last_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
            type: "alpha"
          }),
        cell: ({ cell, row }) =>
          h(
            ULink,
            {
              key: row.original.player.id,
              to: {
                name: "player",
                params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
              },
              class: "hover-link w-fit"
            },
            () => cell.getValue()
          )
      }
    ]
  }),
  {
    accessorKey: "finals",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Finals Played"
      })
  },
  columnHelper.group({
    header: "Singles",
    columns: [
      {
        accessorKey: "singles_wins",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Wins"
          })
      },
      {
        accessorKey: "singles_losses",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Losses"
          })
      },
      {
        id: "singles_percent",
        accessorFn: row => `${row.singles_wins + row.singles_losses ? percentage(row.singles_wins, row.singles_wins + row.singles_losses) : 0}%`,
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          })
      }
    ]
  }),
  columnHelper.group({
    header: "Doubles",
    columns: [
      {
        accessorKey: "doubles_wins",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Wins"
          })
      },
      {
        accessorKey: "doubles_losses",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Losses"
          })
      },
      {
        id: "doubles_percent",
        accessorFn: row => `${row.doubles_wins + row.doubles_losses ? percentage(row.doubles_wins, row.doubles_wins + row.doubles_losses) : 0}%`,
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Win %"
          })
      }
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
    <u-page-grid
      v-if="finalists.length || status === 'pending'"
      class="2xl:grid-cols-4"
    >
      <u-card
        v-if="finalists.length"
        v-for="finalist in finalists"
        :key="finalist.player.id"
        :class="`ring-${getTourColour([finalist.player.tour])}`"
      >
        <template #header>
          <div class="flex justify-between items-center font-semibold">
            <player-link :player="finalist.player" />
            <u-badge
              :label="finalist.player.tour"
              :color="getTourColour([finalist.player.tour])"
            />
          </div>
        </template>

        <div class="w-full text-sm">
          <div class="grid grid-cols-4">
            <div></div>
            <div class="text-center">Titles</div>
            <div class="text-center">Runner-up</div>
            <div class="text-center">Win %</div>
          </div>

          <div class="grid grid-cols-4">
            <div>Singles</div>
            <div class="font-semibold text-center">{{ finalist.singles_wins }}</div>
            <div class="font-semibold text-center">{{ finalist.singles_losses }}</div>
            <div class="font-semibold text-center">
              {{
                finalist.singles_wins + finalist.singles_losses ?
                  percentage(finalist.singles_wins, finalist.singles_wins + finalist.singles_losses)
                : 0
              }}%
            </div>
          </div>

          <div class="grid grid-cols-4">
            <div>Doubles</div>
            <div class="font-semibold text-center">{{ finalist.doubles_wins }}</div>
            <div class="font-semibold text-center">{{ finalist.doubles_losses }}</div>
            <div class="font-semibold text-center">
              {{
                finalist.doubles_wins + finalist.doubles_losses ?
                  percentage(finalist.doubles_wins, finalist.doubles_wins + finalist.doubles_losses)
                : 0
              }}%
            </div>
          </div>
        </div>
      </u-card>
      <loading-player
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noTournament"
      :message="`No finalists found for ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="finalists"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No finalists found for ${tournamentName}`"
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
