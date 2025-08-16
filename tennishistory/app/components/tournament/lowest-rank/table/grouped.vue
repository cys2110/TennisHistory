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
  results: TournamentFlattenedLowestRankedType[]
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

const columnHelper = createColumnHelper<TournamentFlattenedLowestRankedType>()

const columns: TableColumn<TournamentFlattenedLowestRankedType>[] = [
  {
    accessorKey: "round",
    meta: { class: { td: "font-semibold" } },
    footer: ({ table }) => `Lowest Rank: ${table.getColumn("rank")?.getFacetedMinMaxValues()?.[1].toLocaleString() ?? ""}`
  },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "rank", aggregationFn: "max" },
  { accessorKey: "year" },
  columnHelper.group({
    header: "Player",
    columns: [
      { accessorKey: "player.country.name" },
      { accessorKey: "player.first_name" },
      {
        accessorKey: "player.last_name",
        footer: ({ table }) => {
          const rankColumn = table.getFilteredRowModel().rows.map(row => row.getValue("rank"))
          return `Average Rank: ${useAverage(rankColumn as number[]).value.toLocaleString()}`
        }
      }
    ]
  })
]

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="results"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No players found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="['round']"
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent', td: 'empty:p-0' }"
  >
    <template #round-header="{ column }">
      <filter-table-header
        :column
        label="Round"
        type="alpha"
      />
    </template>

    <template #round-cell="{ row, cell }">
      <div class="flex items-center gap-2">
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

        <span>{{ cell.getValue() }}</span>
      </div>
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
        v-if="!row.getIsGrouped()"
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
        v-if="!row.getIsGrouped()"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
      >
        {{ row.original.year }}
      </u-link>
      <template v-else>{{ "" }}</template>
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
        v-if="!row.getIsGrouped()"
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
        v-if="!row.getIsGrouped()"
        :to="{
          name: 'player',
          params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
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
        v-if="!row.getIsGrouped()"
        :to="{
          name: 'player',
          params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
        }"
        class="hover-link"
      >
        {{ row.original.player.last_name }}
      </u-link>
    </template>
  </u-table>
</template>
