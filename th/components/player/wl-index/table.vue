<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions, getCoreRowModel } from "@tanstack/vue-table"

const { index, status } = defineProps<{
  index: WLIndexInterface[]
  status: APIStatusType
}>()
const {
  ui: { icons }
} = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))

const categoryColours: Record<"Match Record" | "Pressure Points" | "Environment" | "Other", "joint" | "warning" | "success" | "info"> = {
  "Match Record": "success",
  "Pressure Points": "warning",
  Environment: "joint",
  Other: "info"
}

const columns: TableColumn<WLIndexInterface>[] = [
  { id: "expand" },
  { accessorKey: "category" },
  { accessorKey: "stat" },
  { accessorKey: "level" },
  { accessorKey: "type", header: "Draw Type" },
  {
    accessorKey: "wins",
    header: "Wins",
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.original.category === "Match Record" && row.depth !== 3) {
        return `Overall: ${index[0].wins}`
      } else if (row.getIsGrouped() && row.depth === 3) {
        return `Avg: ${Math.round(row.getValue("wins") as number)}`
      } else {
        return Math.round(row.getValue("wins"))
      }
    }
  },
  {
    accessorKey: "losses",
    header: "Losses",
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.original.category === "Match Record") {
        return `Overall: ${index[0].losses}`
      } else if (row.getIsGrouped()) {
        return `Avg: ${Math.round(row.getValue("losses") as number)}`
      } else {
        return row.getValue("losses")
      }
    }
  },
  {
    accessorKey: "titles",
    header: "Titles",
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.original.category === "Match Record") {
        return `Overall: ${index[0].titles}`
      } else if (row.getIsGrouped() && row.original.category === "Environment") {
        return `Avg: ${Math.round(row.getValue("titles") as number)}`
      } else {
        return row.getValue("titles")
      }
    }
  },
  {
    accessorKey: "value",
    header: "Index",
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.original.category === "Match Record") {
        return `Overall: ${index[0].value}`
      } else if (row.getIsGrouped()) {
        return `Avg: ${(row.getValue("value") as number).toFixed(3)}`
      } else {
        return row.getValue("value")
      }
    }
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="index"
    :columns
    sticky
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['category', 'stat', 'level']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full xl:min-w-3/4 2xl:min-w-1/2 mx-auto max-h-200',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No index available for ${name}`"
  >
    <template #expand-cell="{ row }">
      <div
        v-if="row.getIsGrouped() && row.depth !== 3"
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
          :icon="row.getIsExpanded() ? icons.minus : icons.plus"
          @click="row.toggleExpanded()"
        />

        <u-badge
          v-if="row.groupingColumnId === 'category'"
          :label="row.getValue('category')"
          variant="outline"
          :color="categoryColours[row.getValue('category') as keyof typeof categoryColours]"
        />
        <div v-else-if="row.groupingColumnId === 'stat'">{{ row.getValue("stat") }}</div>
        <u-badge
          v-else-if="row.groupingColumnId === 'level'"
          :label="row.getValue('level')"
          :color="
            row.original.level === 'Tour' ? 'wta'
            : row.original.level === 'Challenger' ? 'singles'
            : 'atp'
          "
        />
      </div>
    </template>
  </u-table>
</template>
