<script setup lang="ts">
import { SurfacesGrid, SurfacesTable } from "#components"

useHead({ title: "Surfaces", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", icon: ICONS.court }
]
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'cards' ? SurfacesGrid : SurfacesTable"
      :key="viewMode"
      :breadcrumbs
    />
  </div>
</template>
