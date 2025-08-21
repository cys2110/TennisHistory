<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
}>()
const { icons } = useAppConfig()

const getIcon = computed(() => {
  const isSorted = column.getIsSorted()
  if (isSorted === "asc") {
    return icons.sortAlphaUp
  } else if (isSorted === "desc") {
    return icons.sortAlphaDown
  }
  return icons.sortAlpha
})

const sortOptions = computed(() => {
  const isSorted = column.getIsSorted()

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: icons.sortAlphaUp,
      checked: isSorted === "asc",
      onSelect: () => (isSorted === "asc" ? column.clearSorting() : column.toggleSorting(false, true))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: icons.sortAlphaDown,
      checked: isSorted === "desc",
      onSelect: () => (isSorted === "desc" ? column.clearSorting() : column.toggleSorting(true, true))
    }
  ]
})

const columnFilterValue = computed({
  get: () => column.getFilterValue() as string,
  set: (value: any) => column.setFilterValue(value)
})
</script>

<template>
  <div class="w-fit flex justify-center items-center gap-2 mx-auto">
    <u-dropdown-menu :items="sortOptions">
      <u-button
        color="neutral"
        variant="ghost"
        :icon="getIcon"
        class="-mx-2.5 data-[state=open]:bg-elevated"
      />
    </u-dropdown-menu>
    <u-input
      v-model="columnFilterValue"
      :placeholder="`Search ${label}`"
      class="w-fit"
      size="sm"
    />
  </div>
</template>
