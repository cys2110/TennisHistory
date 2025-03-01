<script setup lang="ts">
defineProps<{ category: string }>()
</script>

<template>
  <u-avatar
    :src="`/category/${category}.svg`"
    :alt="category"
    size="xl"
    :icon="ICONS.trophy"
    :ui="{ root: 'bg-slate-300', image: 'object-contain' }"
  />
</template>
