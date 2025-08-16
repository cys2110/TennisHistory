<script setup lang="ts">
defineProps<{ size?: "sm" | "md" | "xs"; header?: boolean }>()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<number | undefined>()
</script>

<template>
  <u-form-field
    :label="header ? undefined : 'Year'"
    :size="size ?? (middleSizes ? 'sm' : 'md')"
  >
    <u-select-menu
      v-model="modelValue"
      :items="ALL_YEARS"
      :icon="header ? undefined : icons.year"
      placeholder="Select year"
    />
  </u-form-field>
</template>
