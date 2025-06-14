<script setup lang="ts">
defineProps<{ message: string; icon?: string }>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <u-alert
    :icon="icon ?? icons.caution"
    color="error"
    :title="message"
  />
</template>
