<script setup lang="ts">
defineProps<{ icon: string }>()
</script>

<template>
  <u-alert
    variant="subtle"
    color="warning"
    :icon="icon"
  >
    <template #title>
      <slot />
    </template>
  </u-alert>
</template>
