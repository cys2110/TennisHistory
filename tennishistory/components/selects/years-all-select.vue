<script setup lang="ts">
const modelValue = defineModel<string>()

const ALL_YEARS = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, i) => (1968 + i).toString())
</script>

<template>
  <u-form-field label="Year">
    <u-select
      v-model="modelValue"
      :items="ALL_YEARS"
      :icon="ICONS.calendar"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
