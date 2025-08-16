<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
}>()
const { icons } = useAppConfig()

const getIcon = computed(() => {
  const isSorted = column.getIsSorted()
  switch (isSorted) {
    case "asc":
      return icons.sortNumberUp
    case "desc":
      return icons.sortNumberDown
    default:
      return icons.sortNumber
  }
})

const sortOptions = computed(() => {
  const isSorted = column.getIsSorted()

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: icons.sortNumberUp,
      checked: isSorted === "asc",
      onSelect: () => (isSorted === "asc" ? column.clearSorting() : column.toggleSorting(false, true))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: icons.sortNumberDown,
      checked: isSorted === "desc",
      onSelect: () => (isSorted === "desc" ? column.clearSorting() : column.toggleSorting(true, true))
    }
  ]
})

const columnFilterValue = computed(() => column.getFilterValue())
</script>

<template>
  <div class="w-fit mx-auto">
    <div>{{ label }}</div>
    <div class="flex justify-center items-center gap-2">
      <u-dropdown-menu :items="sortOptions">
        <u-button
          color="neutral"
          variant="ghost"
          :icon="getIcon"
          class="-mx-2.5 data-[state=open]:bg-elevated"
        />
      </u-dropdown-menu>
      <u-input
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:model-value="column.setFilterValue((old: [number, number]) => [$event, old?.[1]])"
        placeholder="Min"
        size="sm"
        class="min-w-13"
      />
      <u-input
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        @update:model-value="column.setFilterValue((old: [number, number]) => [old?.[0], $event])"
        placeholder="Max"
        size="sm"
        class="min-w-13"
      />
    </div>
  </div>
</template>
