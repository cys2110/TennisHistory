<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { name } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<MonthType[]>()

const options = computed(() => {
  const currentMonth = new Date().getMonth()
  if (name === "upcoming-tournaments") {
    return MONTHS.filter((month, index) => index >= currentMonth)
  }
  return MONTHS
})
</script>

<template>
  <u-form-field
    label="Months"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="options"
      :icon="icons.event"
      placeholder="Select months"
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
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select>
  </u-form-field>
</template>
