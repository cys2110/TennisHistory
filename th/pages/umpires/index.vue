<script setup lang="ts">
import { UmpiresGrid, UmpiresTable } from "#components"

useHead({ title: "Umpires", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", icon: ICONS.umpire }
]
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'cards' ? UmpiresGrid : UmpiresTable"
      :key="viewMode"
      :breadcrumbs
    />
  </div>
</template>
