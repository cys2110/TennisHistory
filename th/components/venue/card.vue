<script setup lang="ts">
defineProps<{
  venue: {
    country: CountryInterface
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
      <u-link
        :to="{ name: 'country', params: { id: venue.country.id, name: venue.country.name } }"
        class="flex items-center gap-2"
      >
        <u-icon
          :name="getFlagCode(venue.country)"
          class="text-xl"
        />
        <span class="hover-link">{{ venue.country.name }}</span>
      </u-link>
    </template>

    <template #description>
      <u-page-columns class="w-full">
        <u-page-feature
          v-for="city in venue.cities"
          :key="city.city"
          :ui="{ title: 'text-sm' }"
        >
          <template #title>
            <u-link
              v-if="city.venues.some(venue => !venue.name)"
              :to="{ name: 'venue', params: { id: encodeName(city.city) } }"
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
                :to="{ name: 'venue', params: { id: encodeName(venue.id) } }"
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
