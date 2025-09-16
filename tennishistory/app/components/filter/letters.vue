<script setup lang="ts">
const { lettersOnly = false } = defineProps<{ ui?: any; lettersOnly?: boolean }>()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("lg", "xl")
const modelValue = defineModel<string>()

const letters = computed(() => [
  ...(lettersOnly ? [] : [{ label: "All", value: undefined }]),
  ...LETTERS.map(letter => ({
    label: letter,
    value: letter
  }))
])
</script>

<template>
  <u-radio-group
    v-model="modelValue"
    legend="Filter by letter"
    :items="letters"
    orientation="vertical"
    :size="middleSizes ? 'sm' : 'lg'"
    class="mx-auto my-5"
    :ui="{ item: 'ml-5', ...ui }"
  />
</template>
