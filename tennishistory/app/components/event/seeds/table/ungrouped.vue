<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  seeds: SeedInterface[]
  status: APIStatusType
}>()
const {
  params: { year }
} = useRoute()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columnHelper = createColumnHelper<SeedInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<SeedInterface>[] = [
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "draw" },
  { accessorKey: "seed" },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.team.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId)
      },
      {
        id: "first_name",
        accessorFn: row => row.team.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId)
      },
      {
        id: "last_name",
        accessorFn: row => row.team.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId)
      },
      {
        id: "rank",
        accessorFn: row => row.team.map(player => player.rank),
        sortingFn: (rowA, rowB, columnId) =>
          Math.min(...(rowA.getValue(columnId) as number[])) < Math.min(...(rowB.getValue(columnId) as number[])) ? -1 : 1
      }
    ]
  }),
  { accessorKey: "rank2" }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="seeds"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No seeds in ${tournament?.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160' }"
  >
    <template #tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #type-header="{ column }">
      <filter-table-header
        :column
        label="S/D"
        type="alpha"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #draw-header="{ column }">
      <filter-table-header
        :column
        label="Draw"
        type="alpha"
      />
    </template>

    <template #draw-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.draw"
        :color="row.original.draw === 'Main' ? 'main' : 'qualifying'"
      />
    </template>

    <template #seed-header="{ column }">
      <range-table-header
        :column
        label="Seed"
      />
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
        v-for="player in row.original.team"
        :key="player.id"
        :country="player.country"
        class="mx-auto"
      />
    </template>

    <template #first_name-header="{ column }">
      <filter-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row }">
      <div class="flex flex-col items-center">
        <u-link
          v-for="player in row.original.team"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
          :class="{ 'strike-through': row.original.withdrew }"
        >
          {{ player.first_name }}
        </u-link>
      </div>
    </template>

    <template #last_name-header="{ column }">
      <filter-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row }">
      <div class="flex flex-col items-center">
        <u-link
          v-for="player in row.original.team"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
          :class="{ 'strike-through': row.original.withdrew }"
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>

    <template #rank-header="{ column }">
      <range-table-header
        :column
        label="Rank (at event)"
      />
    </template>

    <template #rank-cell="{ row }">
      <div class="flex flex-col items-center">
        <div
          v-for="player in row.original.team"
          :key="player.id + '-rank'"
        >
          {{ player.rank }}
        </div>
      </div>
    </template>

    <template #rank2-header="{ column }">
      <range-table-header
        :column
        label="Rank (at draw)"
      />
    </template>
  </u-table>
</template>
