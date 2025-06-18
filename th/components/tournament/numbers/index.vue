<script setup lang="ts">
const { icons } = useAppConfig()
</script>

<template>
  <u-alert
    variant="subtle"
    :icon="icons.alert"
    title="Coming soon!"
    color="success"
  />
</template>
