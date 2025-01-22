<script setup lang="ts">
definePageMeta({ name: "tournament" })
const toast = useToast()
const route = useRoute()
const { name, tid } = route.params
const links = ref<{ label: string; to: string }[]>([])
const websiteLink = ref<{ icon: string; to: string; target: string }[]>([])

// API call
const { data: tournament, status } = await useFetch<TournamentType>("/api/tournamentDetails", {
  query: { tid },
  onResponse: ({ response }) => {
    if (response._data.tournament.website) {
      websiteLink.value = [
        {
          icon: ICONS.website,
          target: "_blank",
          to: response._data.tournament.website
        }
      ]
    }
    // Anchor links
    links.value = response._data.events.map((event: TournamentEventType) => ({
      label: event.year,
      to: `#${event.year}`
    }))
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

useHead({ title: tournament.value?.tournament.name ?? useChangeCase(name as string, "capitalCase").value })
</script>

<template>
  <u-page>
    <ClientOnly>
      <u-page-header
        headline="Tournaments"
        :links="websiteLink"
        :title="tournament?.tournament.name ?? useChangeCase(name as string, 'capitalCase').value"
      >
        <template
          #description
          v-if="tournament?.tournament.years"
        >
          {{ tournament.tournament.years }}
        </template>
      </u-page-header>
    </ClientOnly>

    <u-page-body>
      <u-page-grid v-if="tournament && tournament.events.length > 0">
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
        No details about {{ useChangeCase(name as string, "capitalCase").value }} available
      </error-message>
    </u-page-body>

    <!--Right sidebar (visible on large+ screens)-->
    <template #right>
      <u-page-aside>
        <u-page-anchors :links />
      </u-page-aside>
    </template>
  </u-page>
</template>
