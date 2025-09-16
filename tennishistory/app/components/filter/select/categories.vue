<script setup lang="ts">
const { categories } = defineProps<{ categories?: CategoryType[] }>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<CategoryType[]>()

const allCategories = useArrayUnique([...ATP_CATEGORIES, ...WTA_CATEGORIES, ...ITF_MEN_CATEGORIES, ...ITF_WOMEN_CATEGORIES]).value
</script>

<template>
  <u-form-field
    label="Categories"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select-menu
      v-model="modelValue"
      multiple
      :items="categories ?? allCategories"
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
