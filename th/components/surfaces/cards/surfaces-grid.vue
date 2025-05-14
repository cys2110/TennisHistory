<script setup lang="ts">
const { surfaces, count, status } = defineProps<{
  surfaces: SurfaceInterface[]
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
      canLoadMore: () => status !== "pending" && surfaces.length < count
    }
  )
})
</script>

<template>
  <error-message
    v-if="status === 'error' || !count"
    message="No surfaces found"
  />
  <u-page-grid
    v-else
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <base-card
      v-if="count"
      v-for="surface in surfaces"
      :key="surface.id"
      type="surface"
      :surface
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
</template>
