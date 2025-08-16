<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import {
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

defineProps<{
  seeds: SeedInterface[]
  status: APIStatusType
}>()
const {
  params: { year }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columnHelper = createColumnHelper<SeedInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<SeedInterface>[] = [
  { id: "expand" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "draw" },
  { accessorKey: "seed", cell: ({ row, cell }) => (row.getIsGrouped() ? undefined : cell.getValue()) },
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
          Math.min(...(rowA.getValue(columnId) as number[])) < Math.min(...(rowB.getValue(columnId) as number[])) ? -1 : 1,
        aggregationFn: (leafRows, childRows) => {
          const ranks = childRows.map(row => row.original.team.map(player => player.rank)).flat()
          if (ranks.length === 0) {
            return undefined
          } else {
            const sortedRanks = ranks.sort((a, b) => (a ?? 0) - (b ?? 0))
            return `${sortedRanks[0]}-${sortedRanks[sortedRanks.length - 1]}`
          }
        }
      }
    ]
  }),
  {
    accessorKey: "rank2",
    aggregationFn: "extent",
    cell: ({ cell, row }) => {
      return row.getIsGrouped() ? `${(cell.getValue() as number[])[0]}-${(cell.getValue() as number[])[1]}` : cell.getValue()
    }
  }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => {
  return tours.length > 1 ? ["tour", "type", "draw"] : ["type", "draw"]
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
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
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160', td: 'empty:p-0' }"
  >
    <template #expand-cell="{ row }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="icons.chevronDoubleRight"
          :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          @click="row.toggleExpanded()"
        />

        <u-badge
          v-if="row.groupingColumnId === 'tour'"
          class="font-semibold"
          :label="row.original.tour"
          :color="getTourColor([row.original.tour])"
        />

        <u-badge
          v-else-if="row.groupingColumnId === 'type'"
          class="font-semibold"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />

        <u-badge
          v-if="row.groupingColumnId === 'draw'"
          class="font-semibold"
          :label="row.original.draw"
          :color="row.original.draw === 'Main' ? 'main' : 'qualifying'"
        />
      </div>
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
        v-if="!row.getIsGrouped()"
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
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
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
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
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
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
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
