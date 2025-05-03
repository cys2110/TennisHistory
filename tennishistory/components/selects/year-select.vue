<script setup lang="ts">
defineProps<{ items: string[] }>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<string>()
</script>

<template>
  <u-form-field
    label="Year"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      :items
      :icon="ICONS.year"
      placeholder="Select year"
    />
  </u-form-field>
</template>
