<script setup lang="ts">
defineProps<{ total: number; pageSize: number }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const modelValue = defineModel<number>()
</script>

<template>
  <u-pagination
    v-model:page="modelValue"
    :total
    :items-per-page="pageSize"
    variant="ghost"
    color="secondary"
    active-variant="subtle"
    active-color="secondary"
    class="mx-auto mt-auto"
    :size="mdAndUp ? 'lg' : 'xs'"
  />
</template>
