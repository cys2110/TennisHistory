<script setup lang="ts">
const { coaches, count, status } = defineProps<{
  coaches: ({ labels: string[] } & Pick<CoachType, "id" | "name" | "country">)[]
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
      canLoadMore: () => status !== "pending" && coaches.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="coaches.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <coach-card
      v-if="coaches.length"
      v-for="coach in coaches"
      :key="coach.id"
      :coach
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No coaches found"
  />
</template>
