<script setup lang="ts">
defineProps<{ items: number[] }>()
const modelValue = defineModel<number[]>()
</script>

<template>
  <u-form-field label="Years">
    <u-select
      v-model="modelValue"
      multiple
      :items
      :icon="ICONS.calendar"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
