<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<string>()

const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) =>
  (1968 + i).toString()
)
</script>

<template>
  <u-form-field
    label="Year"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      :items="ALL_YEARS"
      :icon="ICONS.year"
      placeholder="Select year"
    />
  </u-form-field>
</template>
