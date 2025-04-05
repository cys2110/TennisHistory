<script setup lang="ts">
definePageMeta({ name: "country" })
const toast = useToast()
const id = useRouteParams<string>("id")

interface CountryAPIResponse {
  country: CountryInterface
  venues: VenueInterface[]
  current_players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
  former_players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
}

// API call
const { data, status } = await useFetch<CountryAPIResponse>("/api/country-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${id}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

useHead({ title: data.value?.country.name, templateParams: { subPage: "Countries" } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: data.value?.country.name, icon: `flag:${data.value?.country.alpha2}-4x3` }
])

// Anchor links
const links = computed(() => {
  if (data.value)
    return [
      [
        {
          label: "Venues",
          type: "label"
        },
        ...(data.value.venues
          ? data.value.venues.map(venue => ({
              to: venue.id,
              label: venue.name
            }))
          : [])
      ],
      [
        {
          label: "Current/Retired Players",
          type: "label"
        },
        ...(data.value.current_players
          ? data.value.current_players.map(player => ({
              to: player.id,
              label: player.name
            }))
          : [])
      ],
      [
        {
          label: "Former Players",
          type: "label"
        },
        ...(data.value.former_players
          ? data.value.former_players.map(player => ({
              to: player.id,
              label: player.name
            }))
          : [])
      ]
    ]
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="items" />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <u-page-columns class="lg:columns-2 xl:columns-2 2xl:columns-2">
        <dashboard-subpanel
          v-if="data?.venues"
          title="Venues"
          :icon="ICONS.venue"
        >
          <u-page-columns class="xl:columns-3 2xl:columns-3">
            <u-page-card
              v-for="venue in data.venues"
              :key="venue.id"
              :title="`${venue.name}, ${venue.city}`"
              :icon="`flag:${data.country.alpha2}-4x3`"
            />
          </u-page-columns>
        </dashboard-subpanel>

        <dashboard-subpanel
          v-if="data?.former_players"
          title="Former Players"
          :icon="ICONS.people"
        >
          <u-page-columns class="xl:columns-3 2xl:columns-3">
            <player-card
              v-for="player in data.former_players"
              :key="player.id"
              :player
            />
          </u-page-columns>
        </dashboard-subpanel>

        <dashboard-subpanel
          v-if="data?.current_players"
          title="Current/Retired Players"
          :icon="ICONS.player"
        >
          <u-page-columns class="xl:columns-3 2xl:columns-3">
            <player-card
              v-for="player in data.current_players"
              :key="player.id"
              :player
            />
          </u-page-columns>
        </dashboard-subpanel>
      </u-page-columns>

      <error-message
        v-if="!data"
        :title="`No details found for ${id}`"
        :icon="ICONS.noCountries"
        :status
      />
    </nuxt-layout>
  </div>
</template>
