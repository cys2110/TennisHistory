<script setup lang="ts">
definePageMeta({ name: "results-archive" })
useHead({ title: "Results Archive", templateParams: { subPage: null } })

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Results Archive", icon: ICONS.event }
]
</script>

<template>
  <tournament-calendar :breadcrumbs />
</template>
