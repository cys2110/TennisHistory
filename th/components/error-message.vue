<script setup lang="ts">
defineProps<{ message: string; icon?: string }>()

const appConfig = useAppConfig()
</script>

<template>
  <u-alert
    :icon="icon ?? appConfig.ui.icons.caution"
    color="warning"
    :title="message"
  />
</template>
