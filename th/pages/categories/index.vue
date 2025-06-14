<script setup lang="ts">
import { CategoryGrid, CategoryTable } from "#components"

useHead({ title: "Categories", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// API call
const { data: categories, status } = await useFetch<CategoryType[]>("/api/categories", {
  default: () => []
})
</script>

<template>
  <page-wrapper>
    <component
      :is="viewMode === 'list' ? CategoryTable : CategoryGrid"
      :key="viewMode"
      :categories
      :status
    />
  </page-wrapper>
</template>
