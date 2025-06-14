<script setup lang="ts">
defineProps<{ ui?: any }>()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const mdAndUp = breakpoints.greaterOrEqual("md")
const modelValue = defineModel<string>()
</script>

<template>
  <u-radio-group
    v-model="modelValue"
    :items="LETTERS"
    :orientation="mdAndUp ? 'horizontal' : 'vertical'"
    :size="middleSizes ? 'sm' : 'lg'"
    class="mx-auto"
    :ui
  />
</template>
