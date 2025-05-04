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
      <base-link
        v-if="city.venues.some(venue => !venue.name)"
        class="hover-link w-fit"
        :id="city.city"
        type="venue"
      />
      <template v-else>{{ city.city }}</template>
    </template>
    <template #description>
      <base-link
        v-for="venue in city.venues"
        :key="venue.id"
        type="venue"
        :id="venue.id"
      >
        {{ venue.name }}
      </base-link>
    </template>
  </u-page-card>
</template>
