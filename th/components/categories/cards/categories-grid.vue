<script setup lang="ts">
const { categories, count, status } = defineProps<{
  categories: CategoryEnum[]
  status: APIStatusType
  count: number
}>()

const skip = defineModel<number>({ default: 0 })

const grid = useTemplateRef<ComponentPublicInstance>("grid")

onMounted(async () => {
  useInfiniteScroll(
    grid.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 90,
      canLoadMore: () => status !== "pending" && categories.length < count
    }
  )
})
</script>

<template>
  <error-message
    v-if="status === 'error' || !count"
    message="No categories found"
  />
  <u-page-grid
    v-else
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <base-card
      v-if="count"
      v-for="category in categories"
      :key="category"
      type="category"
      :id="category"
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
</template>
