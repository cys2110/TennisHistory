<script setup lang="ts">
import { FilterCheckboxSurface, FilterCheckboxTour, FilterSelectSurface, FilterSelectTour } from "#components"

defineProps<{ filters: SelectType[]; items?: string[] }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const year = defineModel<string>("year")
const months = defineModel<MonthType[]>("months")
const tours = defineModel<TourType[]>("tour")
const categories = defineModel<CategoryType[]>("categories")
const surfaces = defineModel<SurfaceType[]>("surfaces")
const environment = defineModel<EnvironmentType[]>("environment")
</script>

<template>
  <filter-select-all-years
    v-if="filters.includes('all-years')"
    v-model="year"
  />
  <filter-select-year
    v-if="filters.includes('year')"
    v-model="year"
    :items="items || []"
  />
  <filter-select-month
    v-if="filters.includes('month')"
    v-model="months"
  />
  <component
    v-if="filters.includes('tour')"
    :is="mdAndDown ? FilterCheckboxTour : FilterSelectTour"
    v-model="tours"
  />
  <filter-select-category
    v-if="filters.includes('category')"
    v-model="categories"
    v-model:tour="tours"
  />
  <component
    v-if="filters.includes('surface')"
    :is="mdAndDown ? FilterCheckboxSurface : FilterSelectSurface"
    v-model="surfaces"
    v-model:environment="environment"
  />
</template>
