<script setup lang="ts">
const { size } = defineProps<{
  size?: "xs" | "sm" | "md" | "lg"
}>()
const modelValue = defineModel<DrawType>()
</script>

<template>
  <u-radio-group
    legend="Draw Type"
    v-model="modelValue"
    :items="['Main', 'Qualifying']"
    orientation="horizontal"
    :size="size ?? 'sm'"
  />
</template>
