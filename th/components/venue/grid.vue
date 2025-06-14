<script setup lang="ts">
const page = ref(1)
const selectedLetter = defineModel<string>()

// API call
const { data, status } = await useFetch<APIVenuesResponseType>("/api/venues", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 40) }
})

// Reset page when the selected letter changes
watch(selectedLetter, () => (page.value = 1))
</script>

<template>
  <u-page-list
    v-if="(data && data.count) || ['pending', 'idle'].includes(status)"
    class="my-5 flex flex-col gap-8"
  >
    <venue-card
      v-if="data?.count"
      v-for="venue in data.countries"
      :key="venue.country.id"
      :venue
    />
    <loading-base
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-list>
  <error-message
    v-else
    message="No venues found"
  />
  <u-pagination
    v-if="data && data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="40"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
