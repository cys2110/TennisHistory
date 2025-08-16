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
  winners: TournamentAgeType[]
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

const columnHelper = createColumnHelper<TournamentAgeType>()

const columns: TableColumn<TournamentAgeType>[] = [
  { id: "expand" },
  { accessorKey: "player.tour" },
  { accessorKey: "type" },
  { accessorKey: "year" },
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
    },
    aggregationFn: (leafRows, childRows) => {
      const totalDays = childRows
        .filter(row => row.original.age)
        .reduce((sum, row) => sum + row.original.age!.months * 30.4375 + (row.original.age?.days || 0), 0)
      const count = childRows.filter(row => row.original.age).length
      const averageDays = totalDays / count

      const years = Math.floor(averageDays / 365.25)
      const months = Math.floor((averageDays % 365.25) / 30.4375)
      const days = Math.floor((averageDays % 365.25) % 30.4375)

      return `Avg: ${years} years, ${months} months, ${days} days`
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
const grouping = computed(() => (tours.length === 1 ? ["type"] : ["player_tour", "type"]))
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
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165', td: 'empty:p-0' }"
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

    <template #player_tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #player_tour-cell="{ row }">
      <u-badge
        v-if="row.getIsGrouped() && row.depth === 0"
        :label="row.original.player.tour"
        :color="getTourColor([row.original.player.tour])"
        class="font-semibold"
      />
      <template v-else>{{ "" }}</template>
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
        v-if="row.getIsGrouped() && row.depth === 1"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        class="font-semibold"
      />
      <template v-else>{{ "" }}</template>
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
        class="hover-link"
      >
        {{ row.original.year }}
      </u-link>
      <template v-else>{{ "" }}</template>
    </template>

    <template #age-header="{ column }">
      <range-table-header
        :column
        label="Age"
      />
    </template>

    <template #age-cell="{ row, cell }">
      <template v-if="!row.getIsGrouped()">
        {{
          row.original.age ?
            `${Math.floor(row.original.age.months / 12)} years, ${row.original.age.months % 12} months, ${row.original.age.days} days`
          : "—"
        }}
      </template>
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
        v-if="!row.getIsGrouped()"
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
