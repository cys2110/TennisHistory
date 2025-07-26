<script setup lang="ts">
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<string | undefined>()
</script>

<template>
  <u-form-field
    label="Year"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select-menu
      v-model="modelValue"
      :items="ALL_YEARS"
      :icon="icons.year"
      placeholder="Select year"
    />
  </u-form-field>
</template>
