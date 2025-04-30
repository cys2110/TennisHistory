<script setup lang="ts">
defineProps<{
  city: { city: string; country: CountryInterface; venues: Pick<VenueInterface, "id" | "name">[] }
}>()
</script>

<template>
  <u-page-card
    highlight
    :ui="{ description: 'flex flex-col gap-1 text-sm', title: 'flex items-center gap-2' }"
  >
    <template #leading>
      <country-link :country="city.country" />
    </template>
    <template #title>
      <u-link
        v-if="city.venues.some(venue => !venue.name)"
        class="hover-link w-fit"
        :to="{ name: 'venue', params: { id: encodeName(city.city) } }"
      >
        {{ city.city }}
      </u-link>
      <template v-else>{{ city.city }}</template>
    </template>
    <template #description>
      <u-link
        v-for="venue in city.venues"
        :key="venue.id"
        :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
        class="hover-link w-fit"
      >
        {{ venue.name }}
      </u-link>
    </template>
  </u-page-card>
</template>
