<script setup lang="ts">
defineProps<{ title: string; icon?: string }>()

const appConfig = useAppConfig()
</script>

<template>
  <u-alert
    :title
    :icon="icon ?? appConfig.ui.icons.caution"
    color="warning"
  />
</template>
