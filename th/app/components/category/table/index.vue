<script setup lang="ts">
import { CategoryTableGrouped, CategoryTableUngrouped } from "#components"

const { categories, status } = defineProps<{
  categories: CategoryType[]
  status: APIStatusType
}>()
const { tableMode } = useDefaultTable()
const formattedCategories = computed(() => {
  return categories.map(category => ({
    category: category,
    tour:
      ["United Cup", "Grand Slam"].includes(category) ? "Joint"
      : category === "Olympics" ? "ITF"
      : ATP_CATEGORIES.includes(category) ? "ATP"
      : WTA_CATEGORIES.includes(category) ? "WTA"
      : ITF_MEN_CATEGORIES.includes(category) ? "ITF (M)"
      : ("ITF (W)" as TourType),
    level: ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category) ? "Challenger" : "Tour"
  })) as { tour: TourType; level: "Challenger" | "Tour"; category: CategoryType }[]
})
</script>

<template>
  <component
    :is="tableMode === 'grouped' ? CategoryTableGrouped : CategoryTableUngrouped"
    :categories="formattedCategories"
    :status
  />
</template>
