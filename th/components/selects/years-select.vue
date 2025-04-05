<script setup lang="ts">
defineProps<{ items: number[] }>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")

const modelValue = defineModel<number[]>()
</script>

<template>
  <u-form-field
    label="Years"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items
      :icon="ICONS.year"
      class="w-full"
      placeholder="Select years"
    />
  </u-form-field>
</template>
