<script setup lang="ts">
useHead({ title: "Players" })
const { viewMode } = useDefaults()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Coaches",
  description: "A collection of tennis players"
}))
</script>

<template>
  <player-table v-if="viewMode === 'list'" />
  <player-grid v-else />
</template>
