<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<string>()
</script>

<template>
  <u-radio-group
    v-model="modelValue"
    :items="LETTERS"
    orientation="horizontal"
    @update:model-value="$emit('update:modelValue', $event)"
    :size="lgAndUp ? 'lg' : 'sm'"
  >
    <template
      #legend
      v-if="lgAndUp"
    >
      Use <u-kbd value="meta" /> <u-kbd value="shift" /> <u-kbd value="letter" /> to select a letter
    </template>
  </u-radio-group>
</template>
