<script setup lang="ts">
import { DrawDiagram, DrawTable } from "#components"

definePageMeta({
  name: "draw",
  layout: "event",
  middleware: [
    function (to, from) {
      if (COUNTRY_DRAWS.includes(to.params.id as string)) {
        return navigateTo({ name: "country-draw" })
      } else if (to.params.id === "9210") {
        return navigateTo({ name: "laver-cup-draw" })
      }
    }
  ]
})
const { viewMode } = useViewMode()
</script>

<template>
  <div>
    <component
      :is="viewMode === 'cards' ? DrawDiagram : DrawTable"
      :key="viewMode"
    />
  </div>
</template>
