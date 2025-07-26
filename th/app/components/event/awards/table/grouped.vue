<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const { params } = useRoute()
const { year, name } = params as { year: string; name: string }
const {
  ui: { icons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])

const columns: TableColumn<RoundInterface>[] = [
  {
    id: "expand"
  },
  {
    id: "tour",
    accessorFn: row =>
      row.labels.includes("ATP") ? "ATP"
      : row.labels.includes("WTA") ? "WTA"
      : row.labels.includes("Men") ? "ITF (M)"
      : "ITF (W)"
  },
  {
    id: "type",
    accessorFn: row => (row.labels.includes("Singles") ? "Singles" : "Doubles")
  },
  {
    id: "draw",
    accessorFn: row => (row.labels.includes("Main") ? "Main" : "Qualifying")
  },
  {
    accessorKey: "number",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) return row.original.round
    }
  },
  {
    accessorKey: "points",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) return row.original.points?.toLocaleString() ?? "—"
    }
  },
  {
    // TODO: Update currencies
    id: "pm",
    accessorFn: row => (row.currency && row.pm ? `${CURRENCIES[row.currency]}${row.pm.toLocaleString()}` : "—")
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="awards"
    :columns="tours.length > 1 ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="status === 'pending'"
    sticky
    :grouping="tours.length > 1 ? ['tour', 'type', 'draw'] : ['type', 'draw']"
    :grouping-options="grouping_options"
    :empty="`No awards available for ${capitalCase(name)} ${year}`"
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-1/2 mx-auto mt-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
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

        <u-badge
          v-if="row.groupingColumnId === 'draw'"
          class="font-semibold"
          :label="row.getValue('draw')"
          :color="row.getValue('draw') === 'Main' ? 'main' : 'qualifying'"
        />
      </div>
    </template>

    <template #number-header="{ column }">
      <sort-table-header
        :column
        label="Round"
        type="alpha"
      />
    </template>

    <template #points-header="{ column }">
      <sort-table-header
        :column
        label="Points"
        type="number"
      />
    </template>

    <template #pm-header="{ column }">
      <sort-table-header
        :column
        label="Prize Money"
        type="number"
      />
    </template>
  </u-table>
</template>
