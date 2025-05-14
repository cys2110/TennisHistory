<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const md = breakpoints.md
const xlAndUp = breakpoints.greaterOrEqual("xl")
const modelValue = defineModel<(keyof typeof MonthEnum)[]>()
</script>

<template>
  <u-form-field
    label="Months"
    :size="xlAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="MONTH_NAMES"
      :icon="ICONS.event"
      placeholder="Select months"
    />
  </u-form-field>
</template>
