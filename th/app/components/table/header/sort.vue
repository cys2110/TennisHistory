<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label, type } = defineProps<{
  column: Column<T>
  label?: string
  type: "alpha" | "number"
}>()

const getIcon = computed(() => {
  const isSorted = column.getIsSorted()
  if (isSorted === "asc") {
    return type === "alpha" ? ICONS.sortAlphaUp : ICONS.sortNumberUp
  } else if (isSorted === "desc") {
    return type === "alpha" ? ICONS.sortAlphaDown : ICONS.sortNumberDown
  }
  return type === "alpha" ? ICONS.sortAlpha : ICONS.sortNumber
})

const sortOptions = computed(() => {
  const isSorted = column.getIsSorted()

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: type === "alpha" ? ICONS.sortAlphaUp : ICONS.sortNumberUp,
      checked: isSorted === "asc",
      onSelect: () => (isSorted === "asc" ? column.clearSorting() : column.toggleSorting(false, true))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: type === "alpha" ? ICONS.sortAlphaDown : ICONS.sortNumberDown,
      checked: isSorted === "desc",
      onSelect: () => (isSorted === "desc" ? column.clearSorting() : column.toggleSorting(true, true))
    }
  ]
})
</script>

<template>
  <div class="w-full flex justify-center items-center gap-1">
    <u-dropdown-menu :items="sortOptions">
      <u-button
        color="neutral"
        variant="ghost"
        :label="label ?? undefined"
        :icon="getIcon"
        class="-mx-2.5 data-[state=open]:bg-elevated"
      />
    </u-dropdown-menu>
  </div>
</template>
