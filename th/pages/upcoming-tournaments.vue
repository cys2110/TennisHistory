<script setup lang="ts">
useHead({ title: "Upcoming Tournaments", templateParams: { subPage: null } })

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Upcoming Tournaments", icon: ICONS.upcoming }
]
</script>

<template>
  <tournament-calendar :breadcrumbs />
</template>
