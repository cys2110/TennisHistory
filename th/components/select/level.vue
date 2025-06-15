<script setup lang="ts">
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<"Tour" | "Challenger" | "ITF" | undefined>()
</script>

<template>
  <u-form-field
    label="Event Level"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      :items="['Tour', 'Challenger', 'ITF']"
      placeholder="Select event level"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="icons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="modelValue = undefined"
          label="Clear"
          block
          class="border-t rounded-t-none border-(--ui-border-muted)"
        />
      </template>
    </u-select>
  </u-form-field>
</template>
