<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions, getCoreRowModel } from "@tanstack/vue-table"

const { index, status } = defineProps<{
  index: WLIndexInterface[]
  status: APIStatusType
}>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const categoryColours = {
  "Match Record": "sky",
  "Pressure Points": "fuchsia",
  Environment: "violet",
  Other: "emerald"
}

const columns: TableColumn<WLIndexInterface>[] = [
  { id: "expand" },
  { accessorKey: "category", id: "category" },
  { accessorKey: "stat", header: "" },
  {
    accessorKey: "wins",
    header: "Wins",
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.original.category === "Match Record") {
        return `Overall: ${index[0].wins}`
      } else if (row.getIsGrouped()) {
        return `Avg: ${Math.round(row.getValue("wins") as number)}`
      } else {
        return row.getValue("wins")
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
    class="w-full mx-auto max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['category']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>

    <template #empty> No index available available for {{ name }} </template>

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
          :icon="row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus"
          @click="row.toggleExpanded()"
        />

        <u-badge
          :label="row.getValue('category')"
          variant="outline"
          :class="`text-${categoryColours[row.original.category as keyof typeof categoryColours]}-700 dark:text-${categoryColours[row.original.category as keyof typeof categoryColours]}-400 ring-${categoryColours[row.original.category as keyof typeof categoryColours]}-700 dark:ring-${categoryColours[row.original.category as keyof typeof categoryColours]}-400`"
        />
      </div>
    </template>
  </u-table>
</template>
