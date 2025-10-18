<script setup lang="ts">
const { type = "text" } = defineProps<{ placeholder: string; type?: string; block?: boolean }>()
const modelValue = defineModel<string | number | undefined>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <u-input
    v-model="modelValue"
    :placeholder
    :type
    :class="{ 'w-fit max-w-50': !block }"
  >
    <template
      v-if="(modelValue || (modelValue as string)?.length)"
      #trailing
    >
      <u-button
        color="neutral"
        variant="link"
        size="xs"
        :icon="icons.close"
        aria-label="Clear input"
        @click="modelValue = undefined"
      />
    </template>
  </u-input>
</template>
