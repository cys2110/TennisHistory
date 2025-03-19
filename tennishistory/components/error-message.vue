<script setup lang="ts">
defineProps<{ title: string; icon?: string }>()
</script>

<template>
  <u-alert
    :title
    :icon="icon ?? ICONS['no-info']"
  />
</template>
