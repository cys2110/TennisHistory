<script setup lang="ts">
import { Message } from 'primevue'
defineProps<{ icon: string[] }>()
</script>

<template>
  <Message severity="warn">
    <template #icon>
      <fa-icon :icon="icon" />
    </template>
    <slot name="error-message" />
  </Message>
</template>

<style scoped></style>
