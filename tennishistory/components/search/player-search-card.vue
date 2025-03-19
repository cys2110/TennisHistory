<script setup lang="ts">
const { result } = defineProps<{ result: any }>()

// API call
const { data: country } = await useFetch<CountryInterface>("/api/player-country", { query: { id: result.properties.id } })
</script>

<template>
  <u-page-card
    v-if="country"
    highlight
    :title="`${result.properties.first_name} ${result.properties.last_name}`"
    :to="{ name: 'player', params: { id: result.properties.id, name: useChangeCase(`${result.properties.first_name} ${result.properties.last_name}`, 'kebabCase').value } }"
    :icon="`flag:${country.alpha2}-4x3`"
  >
    <nuxt-img
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${result.properties.id}`"
      :alt="result.properties.name"
      class="border border-neutral-500 rounded-full"
    />
  </u-page-card>
</template>
