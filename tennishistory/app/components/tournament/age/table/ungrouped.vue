<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  winners: TournamentAgeType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<TournamentAgeType>()

const columns: TableColumn<TournamentAgeType>[] = [
  { accessorKey: "year" },
  { accessorKey: "player.tour" },
  { accessorKey: "type" },
  {
    id: "age",
    accessorFn: row => (row.age ? Math.floor(row.age?.months / 12) : undefined),
    sortingFn: (rowA, rowB) => {
      const ageA = rowA.original.age
      const ageB = rowB.original.age

      if (!ageA) return 1
      if (!ageB) return -1

      if (ageA.months === ageB.months) {
        return ageA.days < ageB.days ? -1 : 1
      } else {
        return ageA.months < ageB.months ? -1 : 1
      }
    }
  },
  columnHelper.group({
    header: "Player",
    columns: [{ accessorKey: "player.country.name" }, { accessorKey: "player.first_name" }, { accessorKey: "player.last_name" }]
  })
]

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="winners"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No events found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165' }"
  >
    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row }">
      <u-link
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
        class="font-semibold hover-link"
      >
        {{ row.original.year }}
      </u-link>
    </template>

    <template #player_tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #player_tour-cell="{ row }">
      <u-badge
        :label="row.original.player.tour"
        :color="getTourColor([row.original.player.tour])"
        class="font-semibold"
      />
    </template>

    <template #type-header="{ column }">
      <filter-table-header
        :column
        label="Type"
        type="alpha"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        class="font-semibold"
      />
    </template>

    <template #age-header="{ column }">
      <range-table-header
        :column
        label="Age"
      />
    </template>

    <template #age-cell="{ row }">
      {{
        row.original.age ?
          `${Math.floor(row.original.age.months / 12)} years, ${row.original.age.months % 12} months, ${row.original.age.days} days`
        : "—"
      }}
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
        class="hover-link"
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
        class="hover-link"
      >
        {{ row.original.player.last_name }}
      </u-link>
    </template>
  </u-table>
</template>
