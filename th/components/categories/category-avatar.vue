<script setup lang="ts">
defineProps<{ category: CategoryEnum | "" }>()
</script>

<template>
  <u-tooltip
    :text="category"
    :ui="{ content: 'border border-primary' }"
  >
    <u-avatar
      :src="`/category/${category}.svg`"
      :alt="category"
      size="xl"
      :icon="ICONS.tournament"
      :ui="{ root: 'bg-neutral-300 cursor-pointer', image: 'object-contain' }"
      @click="() => navigateTo({ name: 'category', params: { id: encodeName(category) } })"
    />
  </u-tooltip>
</template>
