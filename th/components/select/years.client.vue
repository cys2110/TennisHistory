<script setup lang="ts">
defineProps<{ items: string[] }>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")

const modelValue = defineModel<string[]>()
</script>

<template>
  <u-form-field
    label="Years"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items
      :icon="icons.year"
      placeholder="Select years"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="appIcons.close"
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
