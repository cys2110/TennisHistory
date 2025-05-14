<script setup lang="ts">
type CountryType = {
  country: CountryInterface
  cities: {
    city: string
    venues: Pick<VenueInterface, "id" | "name">[]
  }[]
}

const { venue } = defineProps<{ venue: CountryType }>()
</script>

<template>
  <u-page-card
    highlight
    :icon="venue.country.alpha2 ? `flag:${venue.country.alpha2}-4x3` : `flags:${venue.country.id}`"
    :ui="{ body: 'w-full' }"
  >
    <template #title>
      <base-link
        type="country"
        :id="venue.country.id"
      >
        {{ venue.country.name }}
      </base-link>
    </template>
    <template #description>
      <u-page-columns class="w-full">
        <u-page-feature
          v-for="city in venue.cities"
          :key="city.city"
          :ui="{ title: 'text-sm' }"
        >
          <template #title>
            <base-link
              v-if="city.venues.some(venue => !venue.name)"
              type="venue"
              :id="city.city"
            />
            <template v-else>{{ city.city }}</template>
          </template>

          <template #description>
            <div class="flex flex-col gap-1">
              <base-link
                v-for="venue in city.venues"
                :key="venue.id"
                type="venue"
                :id="venue.id"
                class="text-sm"
              >
                {{ venue.name }}
              </base-link>
            </div>
          </template>
        </u-page-feature>
      </u-page-columns>
    </template>
  </u-page-card>
</template>
