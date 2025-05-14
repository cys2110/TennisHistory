<script setup lang="ts">
type CountryType = {
  country: CountryInterface
  cities: {
    city: string
    venues: Pick<VenueInterface, "id" | "name">[]
  }[]
}

const { venues, count, status } = defineProps<{
  venues: CountryType[]
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
      canLoadMore: () => status !== "pending" && venues.length < count
    }
  )
})
</script>

<template>
  <u-page-list
    v-if="venues.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2 gap-5"
  >
    <venue-card
      v-if="venues.length"
      v-for="venue in venues"
      :key="venue.country.id"
      :venue
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-list>
  <error-message
    v-else
    message="No venues found"
  />
</template>
