<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

defineProps<{
  rounds: TournamentPmType[]
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

const columns: TableColumn<TournamentPmType>[] = [
  { id: "expand" },
  { accessorKey: "year" },
  { accessorKey: "tour" },
  { accessorKey: "type" },
  { accessorKey: "round" },
  {
    accessorKey: "pm",
    cell: ({ row, cell }) =>
      isDefined(cell.getValue()) && row.original.currency ?
        (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
      : undefined,
    aggregationFn: "max",
    sortUndefined: "last"
  },
  {
    accessorKey: "points",
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined),
    aggregationFn: "max",
    sortUndefined: "last"
  }
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => (tours.length > 1 ? ["year", "tour", "type"] : ["year", "type"]))
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="rounds"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
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
      <u-button
        v-if="row.getIsGrouped()"
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
      <template v-else>{{ " " }}</template>
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
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
      <template v-else>{{ " " }}</template>
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
        v-if="row.getIsGrouped() && row.depth === 2"
        class="font-semibold"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
      <template v-else>{{ " " }}</template>
    </template>

    <template #round-header="{ column }">
      <filter-table-header
        :column
        label="Round"
        type="alpha"
      />
    </template>

    <template #pm-header="{ column }">
      <range-table-header
        :column
        label="Prize Money"
      />
    </template>

    <template #points-header="{ column }">
      <range-table-header
        :column
        label="Points"
      />
    </template>
  </u-table>
</template>
