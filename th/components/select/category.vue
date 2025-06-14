<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<CategoryType[]>()
const tour = defineModel<TourType | undefined>("tour")

const options = computed(() => {
  switch (tour.value) {
    case "ATP":
      return ATP_CATEGORIES
    case "WTA":
      return WTA_CATEGORIES
    case "ITF - Men's":
      return ITF_MEN_CATEGORIES
    case "ITF - Women's":
      return ITF_WOMEN_CATEGORIES
    default:
      return [...ATP_CATEGORIES, ...WTA_CATEGORIES, ...ITF_MEN_CATEGORIES, ...ITF_WOMEN_CATEGORIES]
  }
})
</script>

<template>
  <u-form-field
    label="Categories"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="options"
      :icon="icons.categories"
      placeholder="Select categories"
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
        />
      </template>
    </u-select>
  </u-form-field>
</template>
