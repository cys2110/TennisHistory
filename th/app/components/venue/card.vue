<script setup lang="ts">
defineProps<{
  country: CountryInterface & {
    cities: {
      city: string
      venues: Pick<VenueInterface, "id" | "name">[]
    }[]
  }
}>()
</script>

<template>
  <u-page-card
    highlight
    highlight-color="joint"
    :ui="{
      body: 'w-full',
      description: 'mt-4'
    }"
  >
    <template #title>
      <country-link
        :country="country"
        :icon-only="false"
      />
    </template>

    <template #description>
      <u-page-columns class="w-full">
        <u-page-feature
          v-for="city in country.cities"
          :key="city.city"
          :ui="{ title: 'text-sm' }"
        >
          <template #title>
            <u-link
              v-if="city.venues.some(venue => !venue.name)"
              :to="{ name: 'venue', params: { id: kebabCase(city.city) } }"
              class="hover-link"
            >
              {{ city.city }}
            </u-link>
            <template v-else>{{ city.city }}</template>
          </template>

          <template #description>
            <div class="flex flex-col gap-1">
              <u-link
                v-for="venue in city.venues"
                :key="venue.id"
                :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
                class="text-sm hover-link w-fit"
              >
                {{ venue.name }}
              </u-link>
            </div>
          </template>
        </u-page-feature>
      </u-page-columns>
    </template>
  </u-page-card>
</template>
