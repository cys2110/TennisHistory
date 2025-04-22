<script setup lang="ts">
const modelValue = defineModel<number>()
</script>

<template>
  <u-form-field
    label="No. of items per page"
    size="sm"
  >
    <u-slider
      v-model="modelValue"
      :min="10"
      :max="50"
      :step="5"
      color="secondary"
      class="mt-3"
    />
  </u-form-field>
</template>
