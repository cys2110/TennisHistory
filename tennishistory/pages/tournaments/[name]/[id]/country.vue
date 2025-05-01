<script setup lang="ts">
definePageMeta({ name: "country-tournament" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
useHead({ title: name.value, templateParams: { subPage: "Tournaments" } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: name.value }
])

interface TournamentDetails extends Pick<TournamentInterface, "website" | "years"> {
  events: CountryEventType[]
}

// API call
const { data: tournament, status } = await useFetch<TournamentDetails>(
  "/api/tournaments/country-tournament-details",
  {
    query: { tid: route.params.id },
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching details for ${name.value}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

// Anchor links
const links = computed(() => {
  if (tournament.value)
    return tournament.value.events.map(event => ({
      to: "#event-" + event.id,
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

      <u-page-grid v-if="tournament?.events.length || ['pending', 'idle'].includes(status)">
        <country-event-card
          v-if="tournament?.events.length"
          v-for="event in tournament.events"
          :key="event.id"
          :id="event.id"
          :event
        />
        <tournament-event-loading-card
          v-else
          v-for="_ in 5"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noTournament"
        :title="`No events found for ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
