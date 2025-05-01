<script setup lang="ts">
defineProps<{ category: CategoryEnum | "" }>()
</script>

<template>
  <u-avatar
    :src="`/category/${category}.svg`"
    :alt="category"
    size="xl"
    :icon="ICONS.tournament"
    :ui="{ root: 'bg-neutral-300', image: 'object-contain' }"
  />
</template>
