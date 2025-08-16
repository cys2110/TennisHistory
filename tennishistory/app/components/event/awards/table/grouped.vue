<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const {
  params: { year }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columns: TableColumn<RoundInterface>[] = [
  { id: "expand" },
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
const grouping = computed(() => {
  return tours.length > 1 ? ["tour", "type"] : ["type"]
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="awards"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No awards available for ${tournament?.name} ${year}`"
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
          :label="row.getValue('tour')"
          :color="getTourColor([row.getValue('tour')])"
        />

        <u-badge
          v-else-if="row.groupingColumnId === 'type'"
          class="font-semibold"
          :label="row.getValue('type')"
          :color="row.getValue('type') === 'Singles' ? 'singles' : 'doubles'"
        />
      </div>
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
        :color="getTourColor([row.original.tour])"
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
