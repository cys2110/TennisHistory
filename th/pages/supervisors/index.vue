<script setup lang="ts">
import { SupervisorsGrid, SupervisorsTable } from "#components"

useHead({ title: "Supervisors", templateParams: { subPage: null } })
const { viewMode } = useViewMode()

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", icon: ICONS.supervisor }
]
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'cards' ? SupervisorsGrid : SupervisorsTable"
      :key="viewMode"
      :breadcrumbs
    />
  </div>
</template>
