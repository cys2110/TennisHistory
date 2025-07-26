<script setup lang="ts" generic="T">
const { type } = defineProps<{
  label: string
  type: "alpha" | "number"
}>()
const { icons } = useAppConfig()
const sort = defineModel<SortType>()

const getIcon = computed(() => {
  if (get(sort) === "ASC") {
    return type === "alpha" ? icons.sortAlphaUp : icons.sortNumberUp
  } else if (get(sort) === "DESC") {
    return type === "alpha" ? icons.sortAlphaDown : icons.sortNumberDown
  }
  return type === "alpha" ? icons.sortAlpha : icons.sortNumber
})

const sortOptions = computed(() => {
  const isSorted = get(sort)

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: type === "alpha" ? icons.sortAlphaUp : icons.sortNumberUp,
      checked: isSorted === "ASC",
      onSelect: () => (isSorted === "ASC" ? set(sort, undefined) : set(sort, "ASC"))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: type === "alpha" ? icons.sortAlphaDown : icons.sortNumberDown,
      checked: isSorted === "DESC",
      onSelect: () => (isSorted === "DESC" ? set(sort, undefined) : set(sort, "DESC"))
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
