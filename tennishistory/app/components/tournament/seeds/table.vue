<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  results: TournamentSeedType[]
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

const columns: TableColumn<TournamentSeedType>[] = [
  { accessorKey: "year" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "round" }
]

const columnFilters = ref([])
const expanded = ref({})
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="results"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No years when the top seeds reached the later rounds of ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:expanded="expanded"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent' }"
  >
    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row }">
      <div class="flex justify-center items-center gap-2">
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

        <u-link
          :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
          class="hover-link font-semibold"
        >
          {{ row.original.year }}</u-link
        >
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
        class="font-semibold"
        :label="row.original.tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
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

    <template #round-header="{ column }">
      <filter-table-header
        :column
        label="Round"
        type="alpha"
      />
    </template>

    <template #expanded="{ row }">
      <tournament-seeds-player-table :teams="row.original.teams" />
    </template>
  </u-table>
</template>
