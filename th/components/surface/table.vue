<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { surfaces, status } = defineProps<{
  surfaces: SurfaceInterface[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()

const columns: TableColumn<SurfaceInterface>[] = [
  {
    accessorKey: "environment",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Environment",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
  },
  {
    accessorKey: "surface",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
  },
  {
    id: "navigation",
    header: "",
    cell: ({ row }) =>
      h(UButton, {
        to: { name: "surface", params: { id: encodeName(row.original.id) } },
        label: "Go to...",
        size: "sm",
        trailingIcon: icons.court
      })
  }
]
</script>

<template>
  <u-table
    :data="surfaces"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No surfaces found"
  />
</template>
