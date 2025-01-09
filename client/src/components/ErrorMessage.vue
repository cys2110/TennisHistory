<script setup lang="ts">
defineProps<{ icon: string[] }>()
</script>

<template>
  <alert variant="destructive">
    <font-awesome-icon :icon />
    <alert-title> <slot name="message" /> </alert-title>
  </alert>
</template>
