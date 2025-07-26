<script setup lang="ts">
const modelValue = defineModel<("Tour" | "Challenger" | "ITF")[]>()
</script>

<template>
  <u-checkbox-group
    legend="Level"
    v-model="modelValue"
    :items="['Tour', 'Challenger', 'ITF']"
    orientation="horizontal"
  />
</template>
