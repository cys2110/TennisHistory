<script setup lang="ts">
defineProps<{ umpire: string }>()
</script>

<template>
  <u-page-card
    :title="umpire"
    :to="{ name: 'umpire', params: { id: encodeName(umpire) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center' }"
  />
</template>
