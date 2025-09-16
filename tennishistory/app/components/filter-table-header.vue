<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label, type } = defineProps<{
  column: Column<T>
  label: string
  type: "alpha" | "number"
}>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

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

const columnFilterValue = computed({
  get: () => (column.getFilterValue() as string[]) ?? [],
  set: (value: any) =>
    column.setFilterValue(
      Array.isArray(value) ? value
      : value ? [value]
      : []
    )
})

const sortedUniqueValues = computed(() => {
  const facetedValues = Array.from(column.getFacetedUniqueValues().keys()) // get faceted values
    .filter(Boolean) // filter any undefined values
    .sort((a, b) => {
      if (type === "alpha") {
        return a.localeCompare(b)
      } else {
        return parseFloat(a) - parseFloat(b)
      }
    }) // sort the values

  return useArrayUnique(facetedValues).value // Return only unique values
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
    <u-select-menu
      v-model="columnFilterValue"
      :items="sortedUniqueValues"
      class="w-fit max-w-50"
      :placeholder="label"
      multiple
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="appIcons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="columnFilterValue = []"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </div>
</template>
