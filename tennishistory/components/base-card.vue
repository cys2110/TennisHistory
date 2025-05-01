<script setup lang="ts">
defineProps<{ type: string; id: string }>()
</script>

<template>
  <u-page-card
    :title="id"
    :to="{ name: type, params: { id: encodeName(id) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
