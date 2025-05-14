<script setup lang="ts">
const { venues, count, status } = defineProps<{
  venues: VenueInterface[]
  status: APIStatusType
  count: number
  name: string | undefined
}>()

const route = useRoute()
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
      canLoadMore: () => status !== "pending" && venues.length < count
    }
  )
})
</script>

<template>
  <u-page-columns
    v-if="venues.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2 xl:columns-2 2xl:columns-3"
  >
    <u-page-card
      v-if="venues"
      v-for="venue in venues"
      :key="venue.id"
      :title="venue.name ? `${venue.name}, ${venue.city}` : venue.city"
      :icon="venue.country.alpha2 ? `flag:${venue.country.alpha2}-4x3` : `flags:${venue.country.id}`"
      :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No venues located in ${name ?? route.params.id}`"
  />
</template>
