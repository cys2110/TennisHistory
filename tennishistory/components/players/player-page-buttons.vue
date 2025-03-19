<script setup lang="ts">
const { name, id } = defineProps<{ name: string; id: string }>()
const route = useRoute()
</script>

<template>
  <template
    v-for="page in PLAYER_PAGES"
    :key="page.name"
  >
    <u-button
      v-if="route.name !== page.name"
      size="xs"
      :label="page.label"
      :icon="page.icon"
      :to="{ name: page.name, params: { name, id } }"
      prefetch-on="interaction"
    />
  </template>
</template>
