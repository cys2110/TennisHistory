<script setup lang="ts">
definePageMeta({ name: "tournament" })
const toast = useToast()
const scroll = useScroll()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")

// API call
const { data: tournament, status } = await useFetch<TournamentType>("/api/tournamentDetails", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching tournament data",
      icon: ICONS.error
    })
  }
})

useHead({ title: tournament.value?.tournament.name ?? useChangeCase(name.value, "capitalCase").value })

// Anchor links for right sidebar
const links = computed(() => {
  // Computed value rather than useFetch onResponse to avoid hydration mismatch
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
    <ClientOnly>
      <u-page-header
        headline="Tournaments"
        :links="websiteLink"
        :title="tournament?.tournament.name ?? useChangeCase(name, 'capitalCase').value"
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
        No details about {{ useChangeCase(name, "capitalCase").value }} available
      </error-message>
    </u-page-body>

    <!--Right sidebar (visible on large+ screens)-->
    <template #right>
      <u-page-aside>
        <div class="text-lg mt-48 mb-2">On this page</div>
        <u-page-list class="gap-2 ml-5">
          <div
            v-for="link in links"
            :key="link.label"
            class="hover-link cursor-pointer text-sm"
            :class="scroll.hash.value === link.to ? 'text-emerald-600' : 'text-slate-400'"
            @click="scroll.scroll(link.to)"
          >
            {{ link.label }}
          </div>
        </u-page-list>
      </u-page-aside>
    </template>
  </u-page>
</template>
