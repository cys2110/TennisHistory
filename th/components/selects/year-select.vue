<script setup lang="ts">
defineProps<{ items: number[] }>()
const modelValue = defineModel<number>()
</script>

<template>
  <u-form-field label="Year">
    <u-select
      v-model="modelValue"
      :items
      :icon="ICONS.year"
      class="w-full"
      placeholder="Select year"
    />
  </u-form-field>
</template>
