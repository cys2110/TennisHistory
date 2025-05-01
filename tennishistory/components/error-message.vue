<script setup lang="ts">
const appConfig = useAppConfig()

defineProps<{
  title: string
  icon?: string
}>()
</script>

<template>
  <u-alert
    :title
    :icon="icon ?? appConfig.ui.icons.caution"
    color="warning"
  />
</template>
