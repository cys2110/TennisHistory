<script setup lang="ts">
defineProps<{ surface: string }>()
</script>

<template>
  <u-page-card
    :title="surface"
    :to="{ name: 'surface', params: { id: encodeName(surface) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
