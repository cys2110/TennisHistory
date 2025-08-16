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
  entries: EntryInterface[]
  status: APIStatusType
  tournament: TournamentInterface
}>()
const {
  params: { year }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()

const columnHelper = createColumnHelper<EntryInterface>()

const columns: TableColumn<EntryInterface>[] = [
  { accessorKey: "country.name" },
  columnHelper.group({
    header: "Player",
    columns: [{ accessorKey: "tour" }, { accessorKey: "first_name" }, { accessorKey: "last_name" }]
  }),
  { accessorKey: "singles_rank", sortUndefined: "last", aggregationFn: "mean" },
  { accessorKey: "doubles_rank", sortUndefined: "last", aggregationFn: "mean" }
]

const columnFilters = ref([])
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="entries"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No entries found for ${tournament.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="['country_name']"
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent', td: 'empty:p-0' }"
  >
    <template #country_name-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country_name-cell="{ row }">
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
          :ui="{
            leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200',
            label: 'font-semibold'
          }"
          @click="row.toggleExpanded()"
        />
        <country-link
          :country="row.original.country"
          class="mx-auto"
        />
      </div>
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
        v-if="!row.getIsGrouped()"
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #first_name-header="{ column }">
      <input-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row, cell }">
      <u-link
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #last_name-header="{ column }">
      <input-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row, cell }">
      <u-link
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #singles_rank-header="{ column }">
      <range-table-header
        :column
        label="Singles Rank"
      />
    </template>

    <template #doubles_rank-header="{ column }">
      <range-table-header
        :column
        label="Doubles Rank"
      />
    </template>
  </u-table>
</template>
