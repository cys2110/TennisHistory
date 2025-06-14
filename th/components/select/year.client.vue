<script setup lang="ts">
defineProps<{ items: string[] }>()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<string>()
</script>

<template>
  <u-form-field
    label="Year"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      :items="items"
      :icon="icons.year"
      placeholder="Select year"
    />
  </u-form-field>
</template>
