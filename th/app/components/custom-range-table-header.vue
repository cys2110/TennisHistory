<script setup lang="ts" generic="T">
const { label } = defineProps<{
  label: string
}>()
const { icons } = useAppConfig()
const sort = defineModel<SortType>("sort")
const range = defineModel<number[]>("range")
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

const setRange = (value: number, type: "Min" | "Max") => {
  if (type === "Min") {
    if (range.value?.length) {
      range.value = [value, range.value[1]!]
    } else {
      range.value = [value, new Date().getFullYear()]
    }
  } else {
    if (range.value?.length) {
      range.value = [range.value[0]!, value]
    } else {
      range.value = [0, value]
    }
  }
}
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
        :model-value="range?.[0]"
        @update:model-value="setRange($event, 'Min')"
        placeholder="Min"
        size="sm"
        class="min-w-13"
      />
      <u-input
        type="number"
        :model-value="range?.[1]"
        @update:model-value="setRange($event, 'Min')"
        placeholder="Max"
        size="sm"
        class="min-w-13"
      />
    </div>
  </div>
</template>
