<script setup lang="ts">
import { VenuesGrid, VenuesTable } from "#components"

useHead({ title: "Venues", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", icon: ICONS.venue }
]
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'cards' ? VenuesGrid : VenuesTable"
      :key="viewMode"
      :breadcrumbs
    />
  </div>
</template>
