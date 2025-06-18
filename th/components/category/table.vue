<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { categories, status } = defineProps<{
  categories: CategoryType[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()

const columns: TableColumn<CategoryType>[] = [
  {
    id: "category",
    accessorFn: row => row ?? "—",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Category",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) =>
      h(
        ULink,
        {
          to: { name: "category", params: { id: encodeName(row.original) } },
          class: "hover-link"
        },
        () => row.original
      )
  }
]
</script>

<template>
  <u-table
    :data="categories"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No categories found"
  />
</template>
