<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  teams: EntryInfoInterface[]
  status: APIStatusType
}>()
const {
  params: { year }
} = useRoute()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columnHelper = createColumnHelper<EntryInfoInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<EntryInfoInterface>[] = [
  { accessorKey: "label" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "draw" },
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
      }
    ]
  }),
  {
    id: "reason",
    header: "Rank/Reason",
    accessorFn: row => {
      if (row.rank) {
        if (row.status === "PR") return `P${row.rank}`
        return row.rank
      }

      if (row.team[0]?.reason && row.team[0].reason !== "teammate")
        return `${row.type === "Singles" ? "" : `${row.team[0].last_name} - `} ${row.team[0].reason}`
      if (row.team[1]?.reason && row.team[1].reason !== "teammate") return `${row.team[1].last_name} - ${row.team[1].reason}`
      if (row.team_reason) return row.team_reason
    }
  }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="teams"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No entry information available for ${tournament?.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160' }"
  >
    <template #label-header="{ column }">
      <filter-table-header
        :column="column"
        label="Entry Type"
        type="alpha"
      />
    </template>

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
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>
  </u-table>
</template>
