<script setup lang="ts">
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<CategoryType[]>()
const tours = defineModel<TourType[]>("tour")

const options = computed(() => {
  if (tours.value === undefined || tours.value.length === 4) {
    return useArrayUnique([...ATP_CATEGORIES, ...WTA_CATEGORIES, ...ITF_MEN_CATEGORIES, ...ITF_WOMEN_CATEGORIES]).value
  } else {
    const categories: CategoryType[] = []

    if (tours.value.includes("ATP")) categories.push(...ATP_CATEGORIES)
    if (tours.value.includes("WTA")) categories.push(...WTA_CATEGORIES)
    if (tours.value.includes("ITF (M)")) categories.push(...ITF_MEN_CATEGORIES)
    if (tours.value.includes("ITF (W)")) categories.push(...ITF_WOMEN_CATEGORIES)

    return useArrayUnique(categories).value
  }
})
</script>

<template>
  <u-form-field
    label="Categories"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select-menu
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
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </u-form-field>
</template>
