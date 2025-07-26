<script setup lang="ts">
const { size } = defineProps<{
  size?: "xs" | "sm" | "md" | "lg"
}>()
const modelValue = defineModel<MatchType>()
</script>

<template>
  <u-radio-group
    legend="Match Type"
    v-model="modelValue"
    :items="['Singles', 'Doubles']"
    orientation="horizontal"
    :size="size ?? 'sm'"
  />
</template>
