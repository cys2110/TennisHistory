<script setup lang="ts">
import { FilterTableHeader, InputTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { tableMode } = useDefaults()
const {
  ui: { icons }
} = useAppConfig()

const { categories } = defineProps<{
  categories: CategoryType[]
  status: APIStatusType
}>()

type FormattedCategoryType = {
  category: CategoryType
  tour: TourType | "Joint"
  level: LevelType | "ITF"
}

const tableData = computed<FormattedCategoryType[]>(() =>
  categories.map((category: CategoryType) => ({
    category,
    tour:
      ATP_CATEGORIES.includes(category) ? "ATP"
      : WTA_CATEGORIES.includes(category) ? "WTA"
      : ITF_MEN_CATEGORIES.includes(category) ? "ITF (M)"
      : ITF_WOMEN_CATEGORIES.includes(category) ? "ITF (W)"
      : "Joint",
    level:
      ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category) ? "Challenger"
      : ATP_CATEGORIES.includes(category) || WTA_CATEGORIES.includes(category) ? "Tour"
      : "ITF"
  }))
)

const columns = computed<TableColumn<FormattedCategoryType>[]>(() => [
  ...(tableMode.value === "grouped" ?
    [
      {
        id: "expand",
        cell: ({ row }: { row: any }) => {
          if (row.getIsGrouped()) {
            return h(UButton, {
              icon: icons.chevronDoubleRight,
              size: "xs",
              variant: "link",
              color: "neutral",
              onClick: () => row.toggleExpanded(),
              ui: { leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200" }
            })
          }
        }
      }
    ]
  : []),
  {
    id: "tour",
    accessorFn: row => row.tour ?? "Joint",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    sortUndefined: "last",
    cell: ({ row, cell }) => {
      const value = cell.getValue() as TourType

      if (value) {
        if (tableMode.value === "grouped") {
          if (row.getIsGrouped() && row.depth === 0) {
            return h(UBadge, {
              label: value,
              color: getTourColour([value])
            })
          }
        } else {
          return h(UBadge, {
            label: value,
            color: getTourColour([value])
          })
        }
      }
    },
    footer: ({ table }) => {
      const filteredRows = table.getFilteredRowModel()
      return `Total: ${filteredRows.rows.length}`
    }
  },
  {
    accessorKey: "level",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Level",
        type: "alpha"
      }),
    sortUndefined: "last",
    cell: ({ cell, row }) => {
      const value = cell.getValue() as string

      if (value)
        if (tableMode.value === "grouped") {
          if (row.getIsGrouped() && row.depth === 1) {
            return h(UBadge, {
              label: value,
              color: value.toLowerCase() as "challenger" | "tour"
            })
          }
        } else {
          return h(UBadge, {
            label: value,
            color: value.toLowerCase() as "challenger" | "tour"
          })
        }
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) =>
      h(InputTableHeader, {
        column: column as Column<unknown>,
        label: "Category"
      }),
    cell: ({ cell }) => {
      if (cell.getValue()) {
        return h(
          ULink,
          {
            to: { name: "category", params: { id: kebabCase(cell.getValue() as string) } },
            class: "hover-link"
          },
          () => cell.getValue()
        )
      }
    }
  }
])

const grouping = computed(() => (tableMode.value === "grouped" ? ["tour", "level"] : []))

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})

const columnFilters = ref([])
</script>

<template>
  <u-table
    :data="tableData"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No categories found"
    v-model:columnFilters="columnFilters"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="grouping"
    :grouping-options="grouping_options"
    :ui="{
      root: 'w-fit min-w-1/2 mx-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0'
    }"
  />
</template>
