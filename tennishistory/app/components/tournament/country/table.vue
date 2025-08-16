<script setup lang="ts">
import { UBadge } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  countries: TournamentCountryType[]
  status: APIStatusType
}>()
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<TournamentCountryType>()

const columns: TableColumn<TournamentCountryType>[] = [
  {
    accessorKey: "country.name",
    footer: ({ table }) => `Total: ${table.getRowCount()}`
  },
  columnHelper.group({
    header: "Individual Winners",
    columns: [
      columnHelper.group({
        id: "distinct_atp",
        header: () => h(UBadge, { color: "atp", label: "ATP", class: "font-semibold" }),
        columns: [
          { accessorKey: "atp_singles_wins" },
          { accessorKey: "atp_doubles_wins" },
          {
            id: "distinct_total_atp",
            accessorFn: row => row.atp_singles_wins + row.atp_doubles_wins
          }
        ]
      }),
      columnHelper.group({
        id: "distinct_wta",
        header: () => h(UBadge, { color: "wta", label: "WTA", class: "font-semibold" }),
        columns: [
          { accessorKey: "wta_singles_wins" },
          { accessorKey: "wta_doubles_wins" },
          {
            id: "distinct_total_wta",
            accessorFn: row => row.wta_singles_wins + row.wta_doubles_wins
          }
        ]
      }),
      columnHelper.group({
        id: "distinct_total",
        header: () => h(UBadge, { color: "joint", label: "Total", class: "font-semibold" }),
        columns: [
          {
            id: "total_singles",
            accessorFn: row => row.atp_singles_wins + row.wta_singles_wins
          },
          {
            id: "total_doubles",
            accessorFn: row => row.atp_doubles_wins + row.wta_doubles_wins
          },
          {
            id: "distinct_all",
            accessorFn: row => row.atp_singles_wins + row.atp_doubles_wins + row.wta_singles_wins + row.wta_doubles_wins
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
          { accessorKey: "total_atp_singles_wins" },
          { accessorKey: "total_atp_doubles_wins" },
          {
            id: "total_atp",
            accessorFn: row => row.total_atp_singles_wins + row.total_atp_doubles_wins
          }
        ]
      }),
      columnHelper.group({
        id: "total_wta",
        header: () => h(UBadge, { color: "wta", label: "WTA", class: "font-semibold" }),
        columns: [
          { accessorKey: "total_wta_singles_wins" },
          { accessorKey: "total_wta_doubles_wins" },
          {
            id: "total_wta",
            accessorFn: row => row.total_wta_singles_wins + row.total_wta_doubles_wins
          }
        ]
      }),
      columnHelper.group({
        id: "all_total",
        header: () => h(UBadge, { color: "joint", label: "Total", class: "font-semibold" }),
        columns: [
          {
            id: "all_singles",
            accessorFn: row => row.total_atp_singles_wins + row.total_wta_singles_wins
          },
          {
            id: "all_doubles",
            accessorFn: row => row.total_atp_doubles_wins + row.total_wta_doubles_wins
          },
          {
            id: "all_all",
            accessorFn: row => row.total_atp_singles_wins + row.total_atp_doubles_wins + row.total_wta_singles_wins + row.total_wta_doubles_wins
          }
        ]
      })
    ]
  })
]

const columnFilters = ref([])
</script>

<template>
  <u-table
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
    v-model:column-filters="columnFilters"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-170' }"
  >
    <template #country_name-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country_name-cell="{ row }">
      <country-link
        :country="row.original.country"
        class="mx-auto"
        :icon-only="false"
      />
    </template>

    <template #atp_singles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #atp_doubles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #distinct_total_atp-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>

    <template #wta_singles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #wta_doubles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #distinct_total_wta-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_singles-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_doubles-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #distinct_all-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_atp_singles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_atp_doubles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_atp-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_wta_singles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_wta_doubles_wins-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #total_wta-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>

    <template #all_singles-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="singles"
          label="Singles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #all_doubles-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="doubles"
          label="Doubles"
          class="font-semibold"
        />
      </div>
    </template>

    <template #all_all-header="{ column }">
      <div class="flex items-center gap-2">
        <sort-table-header
          :column
          type="number"
        />
        <u-badge
          color="active"
          label="Total"
          class="font-semibold"
        />
      </div>
    </template>
  </u-table>
</template>
