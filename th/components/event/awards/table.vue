<script setup lang="ts">
import { UButton, UIcon, ULink, UTooltip } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { awards, tours } = defineProps<{ awards: RoundInterface[]; status: APIStatusType; tours: TourType[] }>()
const { params } = useRoute()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

const columns: TableColumn<RoundInterface>[] = [
  {
    id: "expand"
  },
  {
    id: "tour",
    accessorFn: row => (row.labels.includes("ATP") ? "ATP" : "WTA")
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
    accessorKey: "round",
    header: "Round"
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) return row.getValue("points") ?? "—"
    }
  },
  {
    accessorFn: row => (row.currency && row.pm ? `${CURRENCIES[row.currency]}${row.pm}` : "—"),
    header: "Prize Money"
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
    :columns="tours.includes('ATP') && tours.includes('WTA') ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="tours.includes('ATP') && tours.includes('WTA') ? ['tour', 'type', 'draw'] : ['type', 'draw']"
    :grouping-options="grouping_options"
    :empty="`No awards available for ${decodeName(params.name as string)} ${params.year}`"
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-1/2 mx-auto mt-5',
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
          :icon="row.getIsExpanded() ? appIcons.minus : appIcons.plus"
          @click="row.toggleExpanded()"
        />

        <u-badge
          v-if="row.groupingColumnId === 'tour'"
          class="font-semibold"
          :label="row.getValue('tour')"
          :color="getTourColours([row.getValue('tour')]).cardColour"
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
          :color="row.getValue('draw') === 'Main' ? 'active' : 'neutral'"
        />
      </div>
    </template>
  </u-table>
</template>
