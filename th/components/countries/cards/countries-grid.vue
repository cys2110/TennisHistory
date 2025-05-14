<script setup lang="ts">
const { countries, count, status } = defineProps<{
  countries: CountryInterface[]
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
      canLoadMore: () => status !== "pending" && countries.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="countries.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <base-card
      v-if="countries.length"
      v-for="country in countries"
      :key="country.id"
      type="country"
      :country
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No countries found"
  />
</template>
