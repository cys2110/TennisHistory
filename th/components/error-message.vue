<script setup lang="ts">
const { title, icon = ICONS.noInfo, status, error } = defineProps<{ title: string; icon?: string; status: "success" | "error" | "pending" | "idle"; error: string }>()
</script>

<template>
  <u-alert
    :title="status === 'success' ? title : `Error fetching ${error}`"
    :icon="status === 'success' ? icon : ICONS.error"
    :color="status === 'success' ? 'warning' : 'error'"
  />
</template>
