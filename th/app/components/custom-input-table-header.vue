<script setup lang="ts" generic="T">
const { label } = defineProps<{
  label: string
}>()
const { icons } = useAppConfig()
const sort = defineModel<SortType>("sort")
const filter = defineModel<string | undefined>("filter")
const sortOrder = defineModel<{ type: string; sort: SortType }[]>("sort-order")

const getIcon = computed(() => {
  if (sort.value === "ASC" || sortOrder.value?.find(v => v.type === label && v.sort === "ASC")) {
    return icons.sortAlphaUp
  } else if (sort.value === "DESC" || sortOrder.value?.find(v => v.type === label && v.sort === "DESC")) {
    return icons.sortAlphaDown
  }
  return icons.sortAlpha
})

const sortOptions = computed(() => [
  {
    label: "Asc",
    type: "checkbox" as const,
    icon: icons.sortAlphaUp,
    checked: sort.value === "ASC",
    onSelect: () => {
      if (sortOrder.value) {
        if (sortOrder.value?.find(v => v.type === label)) {
          sortOrder.value = sortOrder.value?.filter(v => v.type !== label)
        } else {
          sortOrder.value = [...sortOrder.value, { type: label, sort: "ASC" }]
        }
      } else {
        sort.value === "ASC" ? (sort.value = undefined) : (sort.value = "ASC")
      }
    }
  },
  {
    label: "Desc",
    type: "checkbox" as const,
    icon: icons.sortAlphaDown,
    checked: sort.value === "DESC",
    onSelect: () => {
      if (sortOrder.value) {
        if (sortOrder.value?.find(v => v.type === label)) {
          sortOrder.value = sortOrder.value?.filter(v => v.type !== label)
        } else {
          sortOrder.value = [...sortOrder.value, { type: label, sort: "DESC" }]
        }
      } else {
        sort.value === "DESC" ? (sort.value = undefined) : (sort.value = "DESC")
      }
    }
  }
])
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
      v-model="filter"
      :placeholder="`Search ${label}`"
      class="w-fit"
      size="sm"
    />
  </div>
</template>
