<script setup lang="ts">
const { result } = defineProps<{ result: any }>()

// API call
const { data: country } = await useFetch<CountryInterface>("/api/venue-country", { query: { id: result.properties.id } })
</script>

<template>
  <u-page-card
    v-if="country"
    highlight
    :title="result.properties.name"
    :description="`${result.properties.city}, ${country.name}`"
    :to="{ name: 'venue', params: { id: useChangeCase(result.properties.id, 'kebabCase').value } }"
    :icon="`flag:${country.alpha2}-4x3`"
  />
</template>
