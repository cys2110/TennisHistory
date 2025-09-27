<script setup lang="ts">
defineProps<{ items: number[] }>()
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")

const modelValue = defineModel<number | undefined>()
</script>

<template>
  <u-form-field
    label="Year"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      :items
      :icon="ICONS.year"
      placeholder="Select year"
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
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select>
  </u-form-field>
</template>
