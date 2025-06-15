<script setup lang="ts">
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<"Main" | "Qualifying" | undefined>()
</script>

<template>
  <u-form-field
    label="Draw Type"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      :items="['Main', 'Qualifying']"
      placeholder="Select draw type"
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
