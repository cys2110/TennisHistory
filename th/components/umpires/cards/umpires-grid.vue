<script setup lang="ts">
const { umpires, count, status } = defineProps<{
  umpires: string[]
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
      canLoadMore: () => status !== "pending" && umpires.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="umpires.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <base-card
      v-if="umpires.length"
      v-for="umpire in umpires"
      :key="umpire"
      type="umpire"
      :id="umpire"
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No umpires found"
  />
</template>
