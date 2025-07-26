<script setup lang="ts">
import { SortTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { categories, status } = defineProps<{
  categories: { tour: TourType; level: "Challenger" | "Tour"; category: CategoryType }[]
  status: APIStatusType
}>()
const {
  ui: { colors }
} = useAppConfig()

const columns: TableColumn<{ tour: TourType; level: "Challenger" | "Tour"; category: CategoryType }>[] = [
  {
    accessorKey: "tour",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      })
  },
  {
    accessorKey: "level",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Level",
        type: "alpha"
      })
  },
  {
    accessorKey: "category",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Category",
        type: "alpha"
      })
  }
]
</script>

<template>
  <u-table
    :data="categories"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No categories found"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-full md:w-3/4 xl:w-1/2 mx-auto'
    }"
  >
    <template #tour-cell="{ row }">
      <div
        v-if="row.original.tour === ('Joint' as TourType)"
        class="flex items-center gap-2 font-semibold justify-center"
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
    </template>

    <template #category-cell="{ row }">
      <u-link
        :to="{ name: 'category', params: { id: kebabCase(row.original.category) } }"
        class="hover-link"
      >
        {{ row.original.category }}
      </u-link>
    </template>

    <template #level-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.level"
        :color="row.original.level.toLowerCase() as keyof typeof colors"
      />
    </template>
  </u-table>
</template>
