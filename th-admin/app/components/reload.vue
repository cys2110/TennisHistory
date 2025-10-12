<script setup>
const {
  ui: { icons }
} = useAppConfig()
defineProps(["message"])
</script>

<template>
  <div class="flex flex-col gap-1 items-center">
    <div>No {{ message }} found.</div>
    <u-button
      label="Refresh"
      @click="() => reloadNuxtApp()"
      :icon="icons.reload"
    />
  </div>
</template>
