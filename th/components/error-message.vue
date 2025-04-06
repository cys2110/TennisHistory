<script setup lang="ts">
defineProps<{ title: string; icon?: string; status: string; error: string }>()
</script>

<template>
  <u-alert
    :title="status === 'pending' ? 'Loading...' : status === 'error' ? error : title"
    :icon="status === 'pending' ? ICONS.loading : icon"
  />
</template>
