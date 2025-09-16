<script setup lang="ts">
// @ts-nocheck
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const selectedLetter = defineModel<string | undefined>()

interface VenueAPIInterface extends CountryInterface {
  cities: Record<string, VenueInterface[]>[]
}

// API call
const { data: countries, status } = await useFetch<VenueAPIInterface[]>("/api/venues", {
  key: `venues-grid`,
  default: () => []
})

const filteredVenues = computed(() => {
  if (countries.value.length && selectedLetter.value) {
    return countries.value.filter(country => country.name.startsWith(selectedLetter.value!))
  }
  return countries.value
})

// TOC
const toc = computed(() => [
  {
    id: "venues",
    items: filteredVenues.value.map(venue => ({
      label: venue.name,
      to: `#${venue.id}`
    }))
  }
])
</script>

<template>
  <u-page-list v-if="countries.length || status === 'pending'">
    <ClientOnly>
      <teleport to="#toc">
        <u-popover>
          <u-button
            :size="mdAndDown ? 'xs' : 'sm'"
            :icon="icons.toc"
          />
          <template #content>
            <u-command-palette
              placeholder="Search events"
              :groups="toc"
              :loading="status === 'pending'"
              :fuse="{ resultLimit: 200 }"
              :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
            />
          </template>
        </u-popover>
      </teleport>
    </ClientOnly>
    <div
      v-if="countries.length"
      v-for="country in filteredVenues"
      :key="country.id"
      :id="country.id"
    >
      <u-card class="ring-joint my-5">
        <template #header>
          <country-link
            :country="country"
            :icon-only="false"
            class="font-semibold"
          />
        </template>
        <u-page-columns class="w-full">
          <u-page-feature
            v-for="[city, venues] in Object.entries(country.cities)"
            :key="city"
            :ui="{ title: 'text-sm' }"
          >
            <template #title>
              <u-link
                v-if="Array.isArray(venues) && venues.some(venue => !venue.name)"
                :to="{ name: 'venue', params: { id: kebabCase(city) } }"
                class="hover-link"
              >
                {{ city }}
              </u-link>
              <template v-else>{{ city }}</template>
            </template>
            <template #description>
              <div class="flex flex-col gap-1">
                <template
                  v-for="venue in venues"
                  :key="venue.id"
                >
                  <u-link
                    v-if="venue.name"
                    :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
                    class="text-sm hover-link w-fit"
                  >
                    <!--@vue-expect-error-->
                    {{ venue.name }}
                  </u-link>
                </template>
              </div>
            </template>
          </u-page-feature>
        </u-page-columns>
      </u-card>
    </div>

    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />

    <ClientOnly>
      <teleport to="#dashboard-footer"> Total: {{ filteredVenues.length }} </teleport>
    </ClientOnly>
  </u-page-list>
  <error-message
    v-else
    message="No venues found"
  />
</template>
