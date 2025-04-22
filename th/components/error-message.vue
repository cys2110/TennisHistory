<script setup lang="ts">
const { title, icon = ICONS.noInfo, status, error } = defineProps<{ title: string; icon?: string; status: string; error: string }>()
</script>

<template>
  <u-alert
    :title="status === 'error' ? error : title"
    :icon
  />
</template>
