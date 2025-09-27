<script setup lang="ts" generic="T">
const { type = "alpha", loading = false } = defineProps<{
  label: string
  items: string[]
  type?: "alpha" | "number"
  loading?: boolean
}>()
const {
  ui: { icons }
} = useAppConfig()

const sorting = defineModel<SortType>("sort")
const filters = defineModel<string[]>("filters")

const getIcon = computed(() => {
  const isSorted = sorting.value
  if (isSorted === "ASC") {
    return type === "alpha" ? ICONS.sortAlphaUp : ICONS.sortNumberUp
  } else if (isSorted === "DESC") {
    return type === "alpha" ? ICONS.sortAlphaDown : ICONS.sortNumberDown
  }
  return type === "alpha" ? ICONS.sortAlpha : ICONS.sortNumber
})

const sortOptions = computed(() => {
  const isSorted = sorting.value

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: type === "alpha" ? ICONS.sortAlphaUp : ICONS.sortNumberUp,
      checked: isSorted === "ASC",
      onSelect: () => (isSorted === "ASC" ? (sorting.value = undefined) : (sorting.value = "ASC"))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: type === "alpha" ? ICONS.sortAlphaDown : ICONS.sortNumberDown,
      checked: isSorted === "DESC",
      onSelect: () => (isSorted === "DESC" ? (sorting.value = undefined) : (sorting.value = "DESC"))
    }
  ]
})
</script>

<template>
  <div class="flex justify-center items-center gap-1 w-full">
    <u-dropdown-menu :items="sortOptions">
      <u-button
        color="neutral"
        variant="ghost"
        :icon="getIcon"
        class="-mx-2.5 data-[state=open]:bg-elevated"
      />
    </u-dropdown-menu>
    <filter-select
      v-model="filters"
      :options="items"
      multiple
      :placeholder="label"
      :loading
    />
  </div>
</template>
