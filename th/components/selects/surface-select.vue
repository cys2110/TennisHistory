<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const md = breakpoints.md
const xlAndUp = breakpoints.greaterOrEqual("xl")
const modelValue = defineModel<SurfaceEnum[]>()
const environment = defineModel<("Indoor" | "Outdoor")[]>("env")
</script>

<template>
  <u-form-field
    label="Environment"
    :size="xlAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="environment"
      multiple
      :items="['Indoor', 'Outdoor']"
      placeholder="Select environment"
    />
  </u-form-field>
  <u-form-field
    label="Surfaces"
    :size="xlAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="ICONS.court"
      placeholder="Select surfaces"
    />
  </u-form-field>
</template>
