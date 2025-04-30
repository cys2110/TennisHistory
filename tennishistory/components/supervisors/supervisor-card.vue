<script setup lang="ts">
defineProps<{ supervisor: string }>()
</script>

<template>
  <u-page-card
    :title="supervisor"
    :to="{ name: 'supervisor', params: { id: encodeName(supervisor) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
