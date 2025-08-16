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
  winners: TournamentScoreStatsType[]
  status: APIStatusType
}>()

const {
  params: { id, name }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<TournamentScoreStatsType>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<TournamentScoreStatsType>[] = [
  { id: "expand" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "year" },
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
  columnHelper.group({
    header: "Sets",
    columns: [
      {
        accessorKey: "sets_won",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number)
      },
      {
        accessorKey: "sets_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number)
      },
      {
        id: "sets_pc",
        accessorFn: row => (row.sets_won + row.sets_lost ? percentage(row.sets_won, row.sets_won + row.sets_lost) : 0),
        aggregationFn: "mean",
        cell: row => `${Math.round(row.getValue() as number)}%`
      }
    ]
  }),
  columnHelper.group({
    header: "Games",
    columns: [
      {
        accessorKey: "games_won",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number)
      },
      {
        accessorKey: "games_lost",
        aggregationFn: "mean",
        cell: row => Math.round(row.getValue() as number)
      },
      {
        id: "games_pc",
        accessorFn: row => (row.games_won + row.games_lost ? percentage(row.games_won, row.games_won + row.games_lost) : 0),
        aggregationFn: "mean",
        cell: row => `${Math.round(row.getValue() as number)}%`
      }
    ]
  })
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => {
  return tours.length > 1 ? ["tour", "type"] : ["type"]
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="winners"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No winners found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-170', td: 'empty:p-0' }"
  >
    <template #expand-cell="{ row }">
      <u-button
        variant="link"
        color="neutral"
        class="mr-2"
        size="xs"
        :icon="icons.chevronDoubleRight"
        :ui="{
          leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200',
          label: 'font-semibold'
        }"
        @click="row.toggleExpanded()"
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
        v-if="row.getIsGrouped() && row.depth === 0"
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
      <template v-else>{{ "" }}</template>
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
        v-if="row.getIsGrouped() && row.depth === 1"
        class="font-semibold"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
      <template v-else>{{ "" }}</template>
    </template>

    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
        class="hover-link font-semibold"
      >
        {{ cell.getValue() }}
      </u-link>
      <template v-else>{{ "" }}</template>
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
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>

    <template #sets_won-header="{ column }">
      <range-table-header
        :column
        label="Won"
      />
    </template>

    <template #sets_lost-header="{ column }">
      <range-table-header
        :column
        label="Lost"
      />
    </template>

    <template #sets_pc-header="{ column }">
      <range-table-header
        :column
        label="Win %"
      />
    </template>

    <template #games_won-header="{ column }">
      <range-table-header
        :column
        label="Won"
      />
    </template>

    <template #games_lost-header="{ column }">
      <range-table-header
        :column
        label="Lost"
      />
    </template>

    <template #games_pc-header="{ column }">
      <range-table-header
        :column
        label="Win %"
      />
    </template>
  </u-table>
</template>
