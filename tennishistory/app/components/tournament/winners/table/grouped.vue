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
  events: TournamentWinnerFlattenedType[]
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

const columnHelper = createColumnHelper<TournamentWinnerFlattenedType>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<TournamentWinnerFlattenedType>[] = [
  { id: "expand" },
  {
    accessorKey: "year",
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
  },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  columnHelper.group({
    header: "Winner(s)",
    columns: [
      {
        id: "winner_country",
        accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      },
      {
        id: "winner_first_name",
        accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      },
      {
        id: "winner_last_name",
        accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      }
    ]
  }),
  columnHelper.group({
    header: "Finalist(s)",
    columns: [
      {
        id: "finalist_country",
        accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      },
      {
        id: "finalist_first_name",
        accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      },
      {
        id: "finalist_last_name",
        accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes"
      }
    ]
  }),
  {
    id: "score",
    header: "Score"
  }
]

const columnVisibility = ref({
  tour: tours.length > 1
})

const countryColumns: TableColumn<TournamentWinnerFlattenedType>[] = [
  { id: "expand" },
  {
    accessorKey: "year",
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
  },
  {
    id: "winner",
    accessorFn: row => (row.winner as CountryInterface).name
  },
  {
    id: "finalist",
    accessorFn: row => (row.loser as CountryInterface).name
  },
  {
    accessorKey: "score",
    header: "Score"
  }
]

const columnFilters = ref([])

const grouping = computed(() => (tours.length === 1 ? ["year"] : ["year", "tour"]))
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    v-if="!COUNTRY_DRAWS.includes(id as string)"
    :data="events"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No events found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent lg:max-w-17/20 2xl:max-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :class="{ 'lg:max-w-19/20': tours.length === 1 }"
  >
    <template #expand-cell="{ row }">
      <u-button
        v-if="row.getIsGrouped()"
        variant="link"
        color="neutral"
        class="mr-2"
        size="xs"
        :icon="icons.chevronDoubleRight"
        :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        @click="row.toggleExpanded()"
      />
    </template>

    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        v-if="row.getIsGrouped() && row.depth === 0"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
        class="hover-link font-semibold"
      >
        {{ cell.getValue() }}
      </u-link>
      <template v-else>{{ "" }}</template>
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
        v-if="row.getIsGrouped() && row.depth === 1"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour as TourType])"
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
        v-if="!row.getIsGrouped()"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #winner_country-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #winner_country-cell="{ row, cell }">
      <country-link
        v-if="!row.getIsGrouped()"
        v-for="(country, index) in cell.getValue()"
        :key="country"
        :country="(row.original.winner as PlayerInterface[])?.[index]?.country as CountryInterface"
        class="mx-auto"
      />
    </template>

    <template #winner_first_name-header="{ column }">
      <filter-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #winner_first_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.winner as PlayerInterface[]"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link w-fit"
        >
          {{ player.first_name }}
        </u-link>
      </div>
    </template>

    <template #winner_last_name-header="{ column }">
      <filter-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #winner_last_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.winner as PlayerInterface[]"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link w-fit"
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>

    <template #finalist_country-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #finalist_country-cell="{ row, cell }">
      <country-link
        v-if="!row.getIsGrouped()"
        v-for="(country, index) in cell.getValue()"
        :key="country"
        :country="(row.original.loser as PlayerInterface[])?.[index]?.country as CountryInterface"
        class="mx-auto"
      />
    </template>

    <template #finalist_first_name-header="{ column }">
      <filter-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #finalist_first_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.loser as PlayerInterface[]"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link w-fit"
        >
          {{ player.first_name }}
        </u-link>
      </div>
    </template>

    <template #finalist_last_name-header="{ column }">
      <filter-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #finalist_last_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.loser as PlayerInterface[]"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link w-fit"
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>

    <template #score-cell="{ row }">
      <match-score-item
        v-if="!row.getIsGrouped()"
        :labels="row.original.labels as string[]"
        :sets="row.original.sets as number[][][]"
        :year="row.original.year.toString()"
        :id="row.original.id"
        :match_no="1"
        :tournament="{ id: Number(id), name: name as string, tours }"
        :stats="row.original.stats"
        :incomplete="row.original.incomplete"
        centred
      />
    </template>
  </u-table>
  <u-table
    v-else
    :data="events"
    :columns="countryColumns"
    :loading="status === 'pending'"
    sticky
    :empty="`No events found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="['year']"
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent', td: 'empty:p-0' }"
  >
    <template #expand-cell="{ row }">
      <u-button
        v-if="row.getIsGrouped()"
        variant="link"
        color="neutral"
        class="mr-2"
        size="xs"
        :icon="icons.chevronDoubleRight"
        :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        @click="row.toggleExpanded()"
      />
    </template>

    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        v-if="row.getIsGrouped()"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
        class="hover-link font-semibold"
      >
        {{ cell.getValue() }}
      </u-link>
      <template v-else>{{ "" }}</template>
    </template>

    <template #winner-header="{ column }">
      <filter-table-header
        :column
        label="Winner"
        type="alpha"
      />
    </template>

    <template #winner-cell="{ row }">
      <country-link
        v-if="!row.getIsGrouped()"
        :country="row.original.winner as CountryInterface"
        class="mx-auto"
        :icon-only="false"
      />
    </template>

    <template #finalist-header="{ column }">
      <filter-table-header
        :column
        label="Finalist"
        type="alpha"
      />
    </template>

    <template #finalist-cell="{ row, cell }">
      <country-link
        v-if="!row.getIsGrouped()"
        :country="row.original.loser as CountryInterface"
        class="mx-auto"
        :icon-only="false"
      />
    </template>
  </u-table>
</template>
