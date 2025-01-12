<script setup lang="ts">
import { FloatLabel, MultiSelect } from 'primevue'

const props = defineProps<{ label: string; options: string[] }>()

const modelValue = defineModel<string[]>()
</script>

<template>
  <float-label variant="on">
    <multi-select v-model="modelValue" :label :input-id="`select-${label}`" :options size="small" display="chip" :max-selected-labels="1"></multi-select>
    <label :for="`select-${label}`">{{ label }}</label>
  </float-label>
</template>

<style scoped></style>
