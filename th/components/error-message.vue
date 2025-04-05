<script setup lang="ts">
defineProps<{ title: string; icon?: string; status: string }>()
</script>

<template>
  <u-alert
    :title="status === 'pending' ? 'Loading...' : title"
    :icon="status === 'pending' ? ICONS.loading : icon"
  />
</template>
