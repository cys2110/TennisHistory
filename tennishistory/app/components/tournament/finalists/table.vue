<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  finalists: TournamentFinalistType[]
  status: APIStatusType
}>()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<TournamentFinalistType>()

const columns: TableColumn<TournamentFinalistType>[] = [
  columnHelper.group({
    header: "Player",
    columns: [
      { accessorKey: "player.tour", footer: ({ table }) => `Total: ${table.getRowCount()}` },
      { accessorKey: "player.country.name" },
      { accessorKey: "player.first_name" },
      { accessorKey: "player.last_name" }
    ]
  }),
  { accessorKey: "finals" },
  columnHelper.group({
    header: "Singles",
    columns: [
      { accessorKey: "singles_wins" },
      { accessorKey: "singles_losses" },
      {
        id: "singles_percent",
        accessorFn: row => `${row.singles_wins + row.singles_losses ? percentage(row.singles_wins, row.singles_wins + row.singles_losses) : 0}%`
      }
    ]
  }),
  columnHelper.group({
    header: "Doubles",
    columns: [
      { accessorKey: "doubles_wins" },
      { accessorKey: "doubles_losses" },
      {
        id: "doubles_percent",
        accessorFn: row => `${row.doubles_wins + row.doubles_losses ? percentage(row.doubles_wins, row.doubles_wins + row.doubles_losses) : 0}%`
      }
    ]
  })
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
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
    v-model:column-filters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-170' }"
  >
    <template #player_tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #player_tour-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.player.tour"
        :color="getTourColor([row.original.player.tour])"
      />
    </template>

    <template #player_country_name-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #player_country_name-cell="{ row }">
      <country-link
        :country="row.original.player.country"
        class="mx-auto"
      />
    </template>

    <template #player_first_name-header="{ column }">
      <input-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #player_first_name-cell="{ row }">
      <u-link
        :to="{
          name: 'player',
          params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name}-${row.original.player.last_name}`) }
        }"
        class="hover-link mx-auto w-fit"
      >
        {{ row.original.player.first_name }}
      </u-link>
    </template>

    <template #player_last_name-header="{ column }">
      <input-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #player_last_name-cell="{ row }">
      <u-link
        :to="{
          name: 'player',
          params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name}-${row.original.player.last_name}`) }
        }"
        class="hover-link mx-auto w-fit"
      >
        {{ row.original.player.last_name }}
      </u-link>
    </template>

    <template #finals-header="{ column }">
      <range-table-header
        :column
        label="Finals Played"
      />
    </template>

    <template #singles_wins-header="{ column }">
      <range-table-header
        :column
        label="Wins"
      />
    </template>

    <template #singles_losses-header="{ column }">
      <range-table-header
        :column
        label="Losses"
      />
    </template>

    <template #singles_percent-header="{ column }">
      <range-table-header
        :column
        label="Win %"
      />
    </template>

    <template #doubles_wins-header="{ column }">
      <range-table-header
        :column
        label="Wins"
      />
    </template>

    <template #doubles_losses-header="{ column }">
      <range-table-header
        :column
        label="Losses"
      />
    </template>

    <template #doubles_percent-header="{ column }">
      <range-table-header
        :column
        label="Win %"
      />
    </template>
  </u-table>
</template>
