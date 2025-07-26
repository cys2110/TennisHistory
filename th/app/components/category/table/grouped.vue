<script setup lang="ts">
import { SortTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { categories, status } = defineProps<{
  categories: { tour: TourType; level: "Challenger" | "Tour"; category: CategoryType }[]
  status: APIStatusType
}>()
const {
  ui: { icons, colors }
} = useAppConfig()

const columns: TableColumn<{ tour: TourType; level: "Challenger" | "Tour"; category: CategoryType }>[] = [
  { id: "expand" },
  { accessorKey: "tour" },
  { accessorKey: "level" },
  {
    accessorKey: "category",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Category",
        type: "alpha"
      }),
    aggregationFn: "uniqueCount"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="categories"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No categories found"
    :grouping="['tour', 'level']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-full md:w-3/4 xl:w-1/3 mx-auto',
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

        <div v-if="row.groupingColumnId === 'tour'">
          <div
            v-if="row.original.tour === ('Joint' as TourType)"
            class="flex items-center gap-2 font-semibold"
          >
            <u-badge
              color="atp"
              label="ATP"
            />
            <u-badge
              color="wta"
              label="WTA"
            />
          </div>
          <u-badge
            v-else
            class="font-semibold"
            :label="row.getValue('tour')"
            :color="
              row.original.category === 'Olympics' ?
                'joint'
              : getTourColor([row.original.tour.replace('ITF (M)', 'Men').replace('ITF (W)', 'Women') as TourType])
            "
          />
        </div>

        <u-badge
          v-else-if="row.groupingColumnId === 'level'"
          class="font-semibold"
          :label="row.original.level"
          :color="row.original.level.toLowerCase() as keyof typeof colors"
        />
      </div>
    </template>

    <template #category-cell="{ row }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'category', params: { id: kebabCase(row.original.category) } }"
        class="hover-link"
      >
        {{ row.original.category }}
      </u-link>
      <template v-else>{{ row.getValue("category") }}</template>
    </template>
  </u-table>
</template>
