<script setup lang="ts">
const page = ref(1)
const letter = defineModel<string | undefined>()
const skip = defineModel<number>("skip")

watch(
  () => [letter, skip],
  () => (page.value = 1)
)

type VenueAPIType = {
  count: number
  countries: (CountryInterface & {
    cities: {
      city: string
      venues: VenueInterface[]
    }[]
  })[]
}

// API call
const { data, status } = await useFetch<VenueAPIType>("/api/venues", {
  key: `venues-${letter}-${skip}-${page}`,
  query: { letter, skip, page },
  default: () => ({ count: 0, countries: [] })
})
</script>

<template>
  <u-page-list
    v-if="data.count || status === 'pending'"
    class="p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth"
  >
    <venue-card
      v-if="data.count"
      v-for="country in data.countries"
      :key="country.id"
      :country
    />
    <loading-base
      v-else
      v-for="_ in 8"
      :key="_"
    />
  </u-page-list>
  <error-message
    v-else
    message="No venues found"
  />
  <u-pagination
    v-if="data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="skip"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
