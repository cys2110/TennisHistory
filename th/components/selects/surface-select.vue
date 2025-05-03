<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<SurfaceEnum[]>()
</script>

<template>
  <u-form-field
    label="Surfaces"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <template
      #hint
      v-if="lgAndUp"
    >
      <u-kbd value="meta" />
      <u-kbd value="shift" />
      <u-kbd value="s" />
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="ICONS.court"
      placeholder="Select surfaces"
    />
  </u-form-field>
</template>
