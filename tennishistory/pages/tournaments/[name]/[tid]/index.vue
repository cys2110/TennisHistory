<script setup lang="ts">
// @ts-nocheck
definePageMeta({ name: "tournament" }) // Page name for routing
const toast = useToast()
const tournamentName = useTournamentName()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")

// API call
const { data: tournament, status } = await useFetch<TournamentType>("/api/tournamentDetails", {
  query: { tid },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching tournament data",
      icon: ICONS.error,
      description: error?.message
    })
  }
})
tournamentName.tournamentName = tournament.value?.tournament.name ?? name.value // Set tournament name
useHead({ title: tournamentName.capitalisedName }) // Title for tab

// Anchor links for right sidebar - computed to avoid hydration mismatch
const links = computed(() => {
  if (tournament.value) {
    return tournament.value.events.map((event: TournamentEventType) => ({
      label: event.year,
      to: `#${event.year}`
    }))
  }
  return []
})

const websiteLink = computed(() => {
  if (tournament.value?.tournament.website) {
    return [
      {
        color: "secondary",
        icon: ICONS.website,
        target: "_blank",
        to: tournament.value.tournament.website
      }
    ]
  }
  return []
})
</script>

<template>
  <u-page>
    <u-page-header
      headline="Tournaments"
      :links="websiteLink"
      :title="tournamentName.capitalisedName"
      :description="tournament?.tournament.years"
    />

    <u-page-body>
      <!--TODO: Add venues and sponsor names-->
      <u-page-grid
        v-if="tournament && tournament.events.length > 0"
        class="xl:!grid-cols-3 gap-12"
      >
        <tournament-card
          v-for="event in tournament.events"
          :key="event.eid"
          :event
        />
      </u-page-grid>

      <loading-tournament-card v-else-if="status === 'pending'" />

      <error-message
        v-else
        :icon="ICONS['no-calendar']"
      >
        No details about {{ tournamentName.capitalisedName }} available
      </error-message>
    </u-page-body>

    <!--Right sidebar (visible on large+ screens)-->
    <template #right>
      <u-page-aside>
        <div class="text-lg mt-48 mb-2">On this page</div>
        <anchor-links
          :links
          class="w-1/6 text-center"
        />
      </u-page-aside>
    </template>
  </u-page>
</template>
