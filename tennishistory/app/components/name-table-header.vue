<script setup lang="ts" generic="T">
import type { Column } from "@tanstack/vue-table"

const { column, label } = defineProps<{
  column: Column<T>
  label: string
}>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

const getIcon = computed(() => {
  const isSorted = column.getIsSorted()
  switch (isSorted) {
    case "asc":
      return icons.sortAlphaUp
    case "desc":
      return icons.sortAlphaDown
    default:
      return icons.sortAlpha
  }
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
    .flat() // flatten the array in case any unique values are arrays
    .sort((a, b) => a.localeCompare(b)) // sort the values

  const uniqueValues = useArrayUnique(facetedValues) // Return only unique values

  return uniqueValues.value.map(value => {
    const nameArray = value.split(", ")
    return `${nameArray[1]} ${nameArray[0]}`
  })
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
