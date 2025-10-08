<script setup>
defineProps(["placeholder", "size"])

const modelValue = defineModel()
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
</script>

<template>
  <u-popover>
    <u-button
      color="neutral"
      variant="outline"
      icon="lucide:calendar-days"
      block
      :size="size || 'md'"
    >
      {{ modelValue ? `${modelValue.day} ${months[modelValue.month - 1]} ${modelValue.year}` : placeholder }}
    </u-button>

    <template #content>
      <u-calendar v-model="modelValue" />
    </template>
  </u-popover>
</template>
