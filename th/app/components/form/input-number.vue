<script setup lang="ts">
defineProps<{ placeholder: string; min?: number; max?: number; block?: boolean }>()
const modelValue = defineModel<number | undefined>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <u-input-number
    v-model="modelValue"
    :placeholder
    :min="min"
    :max="max"
    :class="{ 'w-fit max-w-50': !block }"
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
      <template v-else>{{ " " }}</template>
    </template>
  </u-input-number>
</template>
