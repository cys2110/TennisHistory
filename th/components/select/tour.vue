<script setup lang="ts">
const {
  ui: { icons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<TourType | undefined>()
</script>

<template>
  <u-form-field
    label="Tour"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      :items="['ATP', 'WTA', 'ITF - Men\'s', 'ITF - Women\'s']"
      placeholder="Select tour"
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
