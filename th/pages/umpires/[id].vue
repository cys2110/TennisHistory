<script setup lang="ts">
import { UmpireGrid, UmpireTable } from "#components"

definePageMeta({ name: "umpire" })
const route = useRoute()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: name.value, templateParams: { subPage: "Umpires" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
  { label: name.value }
])
</script>

<template>
  <div class="w-full">
    <component
      :is="viewMode === 'cards' ? UmpireGrid : UmpireTable"
      :key="viewMode"
      :breadcrumbs
    />
  </div>
</template>
