<script setup lang="ts">
useHead({ title: "Statistics and Records", templateParams: { subPage: null } })

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Statistics and Records", icon: ICONS.stats }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>
      Coming soon...
    </nuxt-layout>
  </div>
</template>
