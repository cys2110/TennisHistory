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
  get: () => column.getFilterValue(),
  set: (value: any) => column.setFilterValue(value)
})

const sortedUniqueValues = computed(() => {
  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys()).filter(Boolean)
  if (Array.isArray(uniqueValues[0])) {
    return useArrayUnique(
      uniqueValues
        .flat()
        .sort((a, b) => {
          if (type === "alpha") {
            return a.localeCompare(b)
          } else {
            return parseFloat(a) - parseFloat(b)
          }
        })
        .map(v => {
          if (v === "Men") return "ITF (M)"
          if (v === "Women") return "ITF (W)"
          return v
        })
    ).value
  }

  return uniqueValues.sort((a, b) => {
    if (type === "alpha") {
      return a.localeCompare(b)
    } else {
      return parseFloat(a) - parseFloat(b)
    }
  })
})
</script>

<template>
  <div class="w-fit flex justify-center items-center gap-1 mx-auto">
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
      class="w-fit"
      :placeholder="label"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="appIcons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="columnFilterValue = undefined"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </div>
</template>
