<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<CategoryEnumType[]>()
</script>

<template>
  <u-form-field
    label="Categories"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <template
      #hint
      v-if="lgAndUp"
    >
      <u-kbd value="meta" />
      <u-kbd value="shift" />
      <u-kbd value="c" />
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="CATEGORIES"
      :icon="ICONS.court"
      class="w-full"
      variant="none"
      placeholder="Select categories"
    />
  </u-form-field>
</template>
