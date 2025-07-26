<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, type } = defineProps<{
  column: Column<T>
  label: string
  type: "alpha" | "number"
}>()
const { icons } = useAppConfig()

const getIcon = computed(() => {
  const isSorted = column.getIsSorted()
  if (isSorted === "asc") {
    return type === "alpha" ? icons.sortAlphaUp : icons.sortNumberUp
  } else if (isSorted === "desc") {
    return type === "alpha" ? icons.sortAlphaDown : icons.sortNumberDown
  }
  return type === "alpha" ? icons.sortAlpha : icons.sortNumber
})

const sortOptions = computed(() => {
  const isSorted = column.getIsSorted()

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: type === "alpha" ? icons.sortAlphaUp : icons.sortNumberUp,
      checked: isSorted === "asc",
      onSelect: () => (isSorted === "asc" ? column.clearSorting() : column.toggleSorting(false, true))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: type === "alpha" ? icons.sortAlphaDown : icons.sortNumberDown,
      checked: isSorted === "desc",
      onSelect: () => (isSorted === "desc" ? column.clearSorting() : column.toggleSorting(true, true))
    }
  ]
})
</script>

<template>
  <u-dropdown-menu :items="sortOptions">
    <u-button
      color="neutral"
      variant="ghost"
      :label
      :icon="getIcon"
      class="-mx-2.5 data-[state=open]:bg-elevated"
    />
  </u-dropdown-menu>
</template>
