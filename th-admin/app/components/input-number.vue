<script setup>
defineProps(["label"])
const modelValue = defineModel()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <u-input-number
    v-model="modelValue"
    :placeholder="`Enter ${label.toLowerCase()}`"
  >
    <template #increment>
      <u-button
        v-if="modelValue !== undefined"
        color="neutral"
        variant="ghost"
        size="xs"
        :icon="icons.close"
        aria-label="Clear input"
        @click="modelValue = undefined"
      />
      <template v-else>{{ "" }}</template>
    </template>
  </u-input-number>
</template>
