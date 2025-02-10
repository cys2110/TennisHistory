<script setup lang="ts">
defineProps<{ icon: string; title: string }>()
</script>

<template>
  <u-alert
    variant="subtle"
    color="warning"
    :icon="icon"
    :title
  />
</template>
