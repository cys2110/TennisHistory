<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<CategoryType[]>()
const {
  ui: { icons }
} = useAppConfig()

const { data: categories, status } = await useFetch("/api/categories", {
  key: "categories",
  default: () => []
})
</script>

<template>
  <u-form-field
    label="Categories"
    :size="middleSizes ? 'sm' : 'md'"
    class="my-3"
  >
    <u-select-menu
      v-model="modelValue"
      multiple
      :items="categories"
      :loading="['idle', 'pending'].includes(status)"
      :icon="ICONS.categories"
      placeholder="Select categories"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="icons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="modelValue = []"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </u-form-field>
</template>
