<script setup lang="ts">
import { SurfaceGrid, SurfaceTable } from "#components"

useHead({ title: "Surfaces", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// API call
const { data: surfaces, status } = await useFetch<SurfaceInterface[]>("/api/surfaces", {
  default: () => []
})
</script>

<template>
  <page-wrapper>
    <component
      :is="viewMode === 'list' ? SurfaceTable : SurfaceGrid"
      :key="viewMode"
      :surfaces
      :status
    />
  </page-wrapper>
</template>
