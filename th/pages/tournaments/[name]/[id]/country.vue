<script setup lang="ts">
definePageMeta({ name: "country-tournament" })
const toast = useToast()
const tid = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })

// API call
const { data: tournament, status } = await useFetch<Pick<TournamentInterface, "website" | "years"> & { events: CountryEventType[] }>("/api/country-tournament-details", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching events for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament }, { label: name.value }])

// Anchor links
const links = computed(() => {
  if (tournament.value)
    return tournament.value.events.map(event => ({
      to: "#event-" + event.eid,
      label: event.year
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #right>
        <u-button
          v-if="tournament?.website"
          :to="tournament.website"
          target="_blank"
          label="Website"
          :icon="ICONS.website"
        />
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted)">{{ tournament?.years }}</div>

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <country-grid
        v-if="tournament && tournament.events.length > 0"
        :events="tournament.events"
      />
      <error-message
        v-else
        :icon="ICONS.noTournament"
        :title="`No events found for ${name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
