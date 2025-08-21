<script setup lang="ts">
useHead({ title: "Coaches" })
const { viewMode } = useDefaults()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Coaches",
  description: "A collection of tennis coaches"
}))
</script>

<template>
  <coach-table v-if="viewMode === 'list'" />
  <coach-grid v-else />
</template>
