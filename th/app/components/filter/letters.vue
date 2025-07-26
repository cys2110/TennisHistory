<script setup lang="ts">
const { allLetters = true } = defineProps<{ ui?: any; allLetters?: boolean }>()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("lg", "xl")
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<string>()

const letters = computed(() => {
  if (allLetters) {
    return [
      { label: "All", value: undefined },
      ...LETTERS.map(letter => ({
        label: letter,
        value: letter
      }))
    ]
  } else {
    return LETTERS.map(letter => ({
      label: letter,
      value: letter
    }))
  }
})
</script>

<template>
  <u-radio-group
    v-model="modelValue"
    :items="letters"
    :orientation="lgAndUp ? 'horizontal' : 'vertical'"
    :size="middleSizes ? 'sm' : 'lg'"
    class="mx-auto"
    :ui
  />
</template>
