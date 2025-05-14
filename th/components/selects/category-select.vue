<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const md = breakpoints.md
const xlAndUp = breakpoints.greaterOrEqual("xl")
const modelValue = defineModel<CategoryEnum[]>()
</script>

<template>
  <u-form-field
    label="Categories"
    :size="xlAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="CATEGORIES"
      :icon="ICONS.categories"
      placeholder="Select categories"
    />
  </u-form-field>
</template>
