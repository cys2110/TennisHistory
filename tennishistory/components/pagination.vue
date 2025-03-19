<script setup lang="ts">
defineProps<{ total: number }>()
const modelValue = defineModel<number>()
</script>

<template>
  <u-pagination
    v-model:page="modelValue"
    :total
    :items-per-page="25"
    variant="ghost"
    color="secondary"
    active-variant="subtle"
    active-color="secondary"
  />
</template>
